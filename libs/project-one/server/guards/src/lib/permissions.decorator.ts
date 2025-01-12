import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsGuard, PermissionsGuardKeyName } from "./permissions.guard";
import { DECORATORS } from '@nestjs/swagger/dist/constants';

// Update type to be of keyof value of PermissionNames
export function Permissions(...permissions: string[]) {
  return applyDecorators(
    SetMetadata(PermissionsGuardKeyName, permissions),
    addRolesToSwaggerDocumentation(permissions),
    UseGuards(PermissionsGuard),
  );
}

function addRolesToSwaggerDocumentation(permissions: string[]) {
  return (target: object, key: string | symbol, descriptor?: TypedPropertyDescriptor<any>): any => {
    if (descriptor) {
      const apiOperation = Reflect.getMetadata(DECORATORS.API_OPERATION, descriptor.value) || {};
      const description = `**Required Permissions:** *${permissions.join(", ")}*<br/>${apiOperation.description || ""}`;
      Reflect.defineMetadata(
        DECORATORS.API_OPERATION,
        {
          ...apiOperation,
          description,
        },
        descriptor.value,
      );
    }
    return descriptor;
  };
}
