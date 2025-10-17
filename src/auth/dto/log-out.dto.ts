import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsStrongPassword } from 'class-validator';

export class LogoutDto {
  @ApiProperty()
  @IsString()
  jwtid: string;
}
