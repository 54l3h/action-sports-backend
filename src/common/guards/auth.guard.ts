import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../services';
import {
  RevokedTokensRepository,
  UserRepository,
} from '../../database/repositories';
import { Types } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly revokedTokensRepository: RevokedTokensRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const { authorization } = request.headers;
      if (!authorization) {
        throw new UnauthorizedException('Missing authorization header');
      }

      const [bearer, token] = authorization.split(' ') || [];
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid token format');
      }

      const data = this.tokenService.verifyToken(
        token,
        process.env.JWT_ACCESS_SECRET!,
      );

      const isTokenRevoked = await this.revokedTokensRepository.findOne({
        filters: { tokenId: data.jti },
      });

      if (isTokenRevoked)
        throw new UnauthorizedException('Your session is expired');

      const user = await this.userRepository.findById(data.id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.role !== data.userType) {
        throw new UnauthorizedException('Invalid token');
      }

      request['user'] = { ...data };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
