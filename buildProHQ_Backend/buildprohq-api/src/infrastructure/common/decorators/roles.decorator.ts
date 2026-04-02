import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (
  ...roles: Array<'manager' | 'field_user' | 'trade_user'>
) => SetMetadata(ROLES_KEY, roles);
