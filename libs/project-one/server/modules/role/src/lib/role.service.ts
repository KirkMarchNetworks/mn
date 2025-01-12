import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleRequestDto } from './dtos/create-role-request.dto';
import { RoleRepo } from '@mn/project-one/server/repos/role';
import { DeleteRoleRequestDto } from './dtos/delete-role-request.dto';
import { PaginatedDto, SimpleResponseDto } from '@mn/project-one/server/dtos';
import { SuperAdminRoleId, allPermissionNames } from '@mn/project-one/shared/models';
import { RoleWithPermissionsEntity } from './entities/role-with-permissions.entity';
import { UserExistsForRoleExceptionDto } from './errors/user-exists-for-role-exception.dto';
import { SharedRepo } from '@mn/project-one/server/repos/shared';
import { DefaultRolesResponseDto } from './dtos/default-roles-response.dto';
import { PaginationInterface } from '@mn/project-one/shared/sort-search-page';
import { RoleEntity } from '@mn/project-one/server/entities';
import { paginationExtractor } from '@mn/project-one/server/models';

@Injectable()
export class RoleService {

  constructor(
    private roleRepo: RoleRepo,
    private sharedRepo: SharedRepo
  ) {}

  async findAllPaginated(tenantId: string, pagination: PaginationInterface): Promise<PaginatedDto<RoleEntity>> {

    const params = paginationExtractor(pagination);

    const totalCount = await this.roleRepo.getRoleCountForTenant(tenantId, params);

    const results = await this.roleRepo.getRoles(tenantId, params);

    const p = new PaginatedDto<RoleEntity>();
    p.take = params.take;
    p.skip = params.skip;
    p.total = totalCount;
    p.results = results;
    return p;
  }

  async createRole(tenantId: string, { name, description, permissionNames }: CreateRoleRequestDto): Promise<RoleWithPermissionsEntity> {
    const createdRole = await this.roleRepo.createRoleAndAddPermissions({
      tenantId,
      name,
      description,
      permissionNames
    });

    const role = await this.roleRepo.getRoleAndPermissionsFromId(createdRole.id);

    if (! role) {
      console.log('Role was created but could not be found?');
      throw new NotFoundException();
    }

    return role;
  }

  async deleteRole(tenantId: string, { id }: DeleteRoleRequestDto): Promise<SimpleResponseDto> {
    await this.sharedRepo.confirmRoleIdBelongsToTenantOrThrow(tenantId, id);

    const usersWithRole = await this.roleRepo.getUserCountFromRoleId(id);

    if (usersWithRole !== 0) {
      throw new UserExistsForRoleExceptionDto();
    }

    await this.roleRepo.deleteRoleFromId(id);

    return {
      success: true
    };
  }

  async createSuperAdminRole(tenantId: string) {
    return await this.roleRepo.createRoleAndAddPermissions({
      tenantId,
      name: 'Super Admin Role',
      description: '',
      permissionNames: allPermissionNames
    }, SuperAdminRoleId);
  }

  async addDefaultRolesWithPermissions(tenantId: string): Promise<DefaultRolesResponseDto> {
    return await this.roleRepo.addDefaultRolesWithPermissionsToTenant(tenantId);
  }
}
