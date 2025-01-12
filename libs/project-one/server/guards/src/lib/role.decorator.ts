import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { RoleGuard, RoleGuardKeyName } from './role.guard';
import { SuperAdminRoleId } from '@mn/project-one/shared/models';

export function Role(roleId: string) {
  return applyDecorators(
    SetMetadata(RoleGuardKeyName, roleId),
    addRolesToSwaggerDocumentation(roleId),
    UseGuards(RoleGuard),
  );
}

function addRolesToSwaggerDocumentation(roleId: string) {
  return (target: object, key: string | symbol, descriptor?: TypedPropertyDescriptor<any>): any => {
    if (descriptor) {
      const apiOperation = Reflect.getMetadata(DECORATORS.API_OPERATION, descriptor.value) || {};

      if (roleId === SuperAdminRoleId) {
        // We do not want to expose the super admin role I.D so update it
        roleId = 'Super Admin Role I.D';
      }
      const description = `**Required Role I.D:** *${ roleId }*<br/>${apiOperation.description || ""}`;
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
