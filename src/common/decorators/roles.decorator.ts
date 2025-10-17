import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, RolesEnum } from '../types';

export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
