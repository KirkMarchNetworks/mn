import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtParsedTokenInterface } from '@mn/project-one/server/models';

export const PermissionsGuardKeyName = 'permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PermissionsGuardKeyName, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredPermissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: JwtParsedTokenInterface = request.user;

    return requiredPermissions.every(permission => user.permissions.includes(permission));
  }
}
