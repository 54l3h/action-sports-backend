import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { GenderEnum, RolesEnum } from 'src/common/types';

export class SignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RolesEnum)
  role: string;

  @ApiProperty()
  @IsEnum(GenderEnum)
  gender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
}
