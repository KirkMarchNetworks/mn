import { Injectable } from '@nestjs/common';
import { RepoOneService } from '@mn/project-one/server/repos/repo-one';
import { CreateRoleInterface } from './models/create-role.interface';
import { roleWithPermissionsSelect, RoleWithPermissionsType } from './types/role-with-permissions.type';
import { DefaultRolesInterface } from './models/default-roles.interface';
import { allPermissionNames, PermissionNames } from '@mn/project-one/shared/models';
import { allDefaultRoles } from './models/all-default-roles';
import { RolePaginationType } from './types/role-pagination.type';

@Injectable()
export class RoleRepo {

  constructor(
    private repoOneService: RepoOneService
  ) {
  }

  async addDefaultRolesWithPermissionsToTenant(tenantId: string) {
    await this.repoOneService.role.createMany({
      data: allDefaultRoles(tenantId)
    })

    return await this.addDefaultPermissionsToTheDefaultRoles(tenantId);
  }

  async addDefaultPermissionsToTheDefaultRoles(tenantId: string): Promise<DefaultRolesInterface> {
    const roles = await this.repoOneService.role.findMany({
      where: {
        tenantId,
        type: {
          not: 'DefaultRole'
        }
      },
      select: {
        id: true,
        type: true
      }
    });

    const adminRole = roles.find(x => x.type === 'AdminRole');
    const someRole = roles.find(x => x.type === 'SomeRole');
    const limitedRole = roles.find(x => x.type === 'LimitedRole');

    if (!adminRole || !someRole || !limitedRole) {
      throw new Error('Unable to find all the default roles');
    }

    // Adds all permissions to the adminRole
    await this._addPermissionsToRoleId(adminRole.id, allPermissionNames);

    // Adds some permissions to the someRole
    await this._addPermissionsToRoleId(someRole.id, [
      PermissionNames.ReadRole,
      PermissionNames.UpdateRole
    ]);

    // Adds a permission to the limitedRole
    await this._addPermissionsToRoleId(limitedRole.id, [
      PermissionNames.ReadRole,
    ]);

    return {
      adminRoleId: adminRole.id,
      someRoleId: someRole.id,
      limitedRoleId: limitedRole.id
    }
  }

  async createRoleAndAddPermissions({ tenantId, name, description, permissionNames = []}: CreateRoleInterface, id: string|undefined = undefined) {
    return await this.repoOneService.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: {
          id,
          tenantId,
          name,
          description,
        },
        select: {
          id: true
        }
      });

      if (permissionNames.length) {
        await tx.permissionToRole.createMany({
          data: permissionNames.map(permissionName => ({
            roleId: role.id,
            permissionName
          }))
        });
      }

      return role;
    })
  }

  async getRoleCountForTenant(tenantId: string, params: RolePaginationType) {
    const where = {
      ...params.where,
      tenantId
    };

    return await this.repoOneService.role.count({
      where
    });
  }

  async getRoles(tenantId: string, params: RolePaginationType) {
    params.where = {
      ...params.where,
      tenantId
    }
    return await this.repoOneService.role.findMany({
      ...params,
      select: roleWithPermissionsSelect
    });
  }


  async getUserCountFromRoleId(roleId: string) {
    return await this.repoOneService.user.count({
      where: {
        roleId
      }
    });
  }

  async getRoleAndPermissionsFromId(id: string): Promise<RoleWithPermissionsType | null> {
    return await this.repoOneService.role.findFirst({
      where: {
        id
      },
      select: roleWithPermissionsSelect
    })
  }

  async deleteRoleFromId(id: string) {
    return await this.repoOneService.role.delete({
      where: {
        id
      },
    })
  }

  private async _addPermissionsToRoleId(roleId: string, permissionNames: string[]) {
    await this.repoOneService.permissionToRole.createMany({
      data: permissionNames.map(permissionName => ({
        roleId,
        permissionName
      }))
    });
  }
}
