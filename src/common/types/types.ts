import { Types } from 'mongoose';

export enum RolesEnum {
  ADMIN = 'admin',
  NORMAL_USER = 'normal_user',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum OtpEnum {
  CONFIRMATION = 'confirmation',
  RESET_PASSWORD = 'reset_password',
}

export interface ITokenPayload {
  id: string;
  userType: RolesEnum;
}

export enum TokenTypes {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

export const ROLES_KEY = 'roles';
