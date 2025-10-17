import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  OtpRepository,
  RevokedTokensRepository,
  UserRepository,
} from '../database/repositories';
import { OtpModel, RevokedTokenModel, UserModel } from '../database/models';
import { TokenService } from '../common/services';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../common/utils';
import { MailModule } from '../common/mail/mail.module';

@Module({
  imports: [UserModel, OtpModel, RevokedTokenModel, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    TokenService,
    JwtService,
    OtpRepository,
    OtpService,
    RevokedTokensRepository,
  ],
})
export class AuthModule {}
