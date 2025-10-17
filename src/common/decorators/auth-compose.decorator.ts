import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesEnum } from '../types';
import { Roles } from './roles.decorator';
import { AuthGuard, RolesGuard } from '../guards';

export function Auth(...roles: RolesEnum[]) {
  return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
}
