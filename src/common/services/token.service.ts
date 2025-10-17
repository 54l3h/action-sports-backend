import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { ITokenPayload, TokenTypes } from '../types';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: any, tokenType: TokenTypes): string {
    return this.jwtService.sign(payload, {
      expiresIn:
        tokenType === TokenTypes.ACCESS_TOKEN
          ? process.env.JWT_ACCESS_EXPIRES_IN
          : process.env.JWT_REFRESH_EXPIRES_IN,
      secret:
        tokenType === TokenTypes.ACCESS_TOKEN
          ? process.env.JWT_ACCESS_SECRET
          : process.env.JWT_REFRESH_SECRET,
      jwtid: randomUUID(),
    });
  }

  generateTokens(payload: ITokenPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.generateToken(payload, TokenTypes.ACCESS_TOKEN);
    const refreshToken = this.generateToken(payload, TokenTypes.REFRESH_TOKEN);

    return { accessToken, refreshToken };
  }

  verifyToken(token: string, secret: string) {
    return this.jwtService.verify(token, { secret });
  }
}
