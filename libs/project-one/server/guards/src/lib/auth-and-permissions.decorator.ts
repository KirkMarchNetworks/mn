import { applyDecorators } from '@nestjs/common';
import { Auth } from './auth.decorator';
import { Permissions } from './permissions.decorator';

export function AuthAndPermissions(...permissions: string[]) {
  return applyDecorators(
    Auth(),
    Permissions(...permissions)
  );
}
