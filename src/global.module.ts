import { Global, Module } from '@nestjs/common';
import { RevokedTokenModel, UserModel } from './database/models';
import { JwtService } from '@nestjs/jwt';
import {
  RevokedTokensRepository,
  UserRepository,
} from './database/repositories';
import { TokenService } from './common/services';

@Global()
@Module({
  imports: [UserModel, RevokedTokenModel],
  controllers: [],
  providers: [
    UserRepository,
    RevokedTokensRepository,
    JwtService,
    TokenService
  ],
  exports: [
    UserRepository,
    RevokedTokensRepository,
    JwtService,
    TokenService,
    UserModel,
    RevokedTokenModel,
  ],
})
export class GlobalModule {}
