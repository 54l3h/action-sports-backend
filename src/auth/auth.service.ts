import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/sign-up.dto';
import {
  OtpRepository,
  RevokedTokensRepository,
  UserRepository,
} from 'src/database/repositories';
import { OtpService } from 'src/common/utils';
import { Events } from 'src/common/mail/utils';
import { verifyHash } from 'src/common/security';
import { TokenService } from 'src/common/services';
import { ConfirmEmailDto, LogoutDto, SigninDto } from './dto';
import { ITokenPayload, OtpEnum, RolesEnum } from 'src/common/types';
import { Types } from 'mongoose';
import { SessionInfo } from 'src/database/models';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly otpRepository: OtpRepository,
    private readonly otpService: OtpService,
    private readonly revokedTokensRepository: RevokedTokensRepository,
  ) {}

  async signup(dto: SignupDto) {
    try {
      const user = await this.userRepository.findByEmail(dto.email);

      if (user) {
        throw new BadRequestException('User already exists');
      }

      const createdUser = await this.userRepository.create(dto);

      if (!createdUser) {
        throw new BadRequestException(
          'Invalid signup data, please check your inputs.',
        );
      }

      const otp = this.otpService.generateOtp();

      await this.otpRepository.createOtp({
        userId: createdUser._id,
        otp,
        otpType: OtpEnum.CONFIRMATION,
      });

      const emailPayload = {
        to: dto.email,
        subject: 'Your OTP Code',
        otp,
        name: dto.firstName,
      };

      Events.emit('sendEmail', emailPayload);

      const payload: ITokenPayload = {
        id: createdUser.id,
        userType: createdUser.role as RolesEnum,
      };

      return this.tokenService.generateTokens(payload);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async signin(dto: SigninDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await verifyHash(user.password, dto.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload: ITokenPayload = {
      id: user.id,
      userType: user.role as RolesEnum,
    };

    return this.tokenService.generateTokens(payload);
  }

  async confirmEmail(userId: string, dto: ConfirmEmailDto) {
    // get the user id by the token which provided (done)

    const user = await this.userRepository.findById(userId);

    if (!user) {
      // This should never happen if the guard is working correctly
      throw new UnauthorizedException('User not found');
    }

    if (user.verifiedAt) {
      throw new BadRequestException('Account is already verified');
    }

    // find the otp document which is associated to the user (done)
    // When comparing the otp which is provided from the user the system should compare the latest otp which have been sent with the provided otp (done)
    // {createdAt:-1} & userId() & otp type is confirmation (done)
    const otpDocument = await this.otpRepository.findConfirmationOtpByUserId(
      new Types.ObjectId(userId),
    );

    if (!otpDocument) {
      throw new BadRequestException('OTP does not exist or has expired');
    }

    const isCorrect = await verifyHash(otpDocument.otp, dto.otp);

    if (!isCorrect) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.userRepository.updateEmailConfirmed(userId);
    await this.otpRepository.findByIdAndDelete(otpDocument._id);
    // OTPs should be deleted after 10 minutes (done)

    return { message: 'Email confirmed successfully' };
  }

  async getProfile(userId) {
    return await this.userRepository.findById(userId);
  }

  async logout(sessionInfo: SessionInfo) {
    await this.revokedTokensRepository.create(sessionInfo);
  }
}
