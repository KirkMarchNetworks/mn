import { applyDecorators } from '@nestjs/common';
import { Auth } from './auth.decorator';
import { Role } from './role.decorator';

export function AuthAndRole(roleId: string) {
  return applyDecorators(
    Auth(),
    Role(roleId)
  );
}
