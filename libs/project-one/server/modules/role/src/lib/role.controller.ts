import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { CreateRoleRequestDto } from './dtos/create-role-request.dto';
import { DeleteRoleRequestDto } from './dtos/delete-role-request.dto';
import { TemplatedApiException } from '@mn/project-one/server/exceptions';
import { UserExistsForRoleExceptionDto } from './errors/user-exists-for-role-exception.dto';
import { ApiPaginatedResponse, Pagination, TenantId } from '@mn/project-one/server/decorators';
import { RoleEntity } from '@mn/project-one/server/entities';
import { PaginationInterface, RoleEntitySearchable } from '@mn/project-one/shared/sort-search-page';

@ApiTags(ServerRouting.role.capitalizedPath)
@Auth()
@Controller(ServerRouting.role.path)
export class RoleController {
  constructor(
    private service: RoleService
  ) {
  }

  @ApiPaginatedResponse(RoleEntity)
  @ApiOperation({ description: `Get all the users for a tenant.`})
  @Get()
  async findAll(
    @TenantId() tenantId: string,
    @Pagination({
      ...RoleEntitySearchable
    }) dto: PaginationInterface
  ) {
    return this.service.findAllPaginated(tenantId, dto);
  }

  @Permissions(PermissionNames.CreateRole)
  @ApiOperation({
    description: `Creates a new role for a tenant and attaches permissions to that role.`
  })
  @Post(ServerRouting.role.children.create.path)
  create(@TenantId() tenantId: string, @Body() dto: CreateRoleRequestDto) {
    return this.service.createRole(tenantId, dto);
  }

  @Permissions(PermissionNames.DeleteRole)
  @ApiOperation({
    description: `Delete a role for a tenant.`
  })
  @TemplatedApiException(() => UserExistsForRoleExceptionDto)
  @Delete(ServerRouting.role.children.delete.path)
  delete(@TenantId() tenantId: string, @Body() dto: DeleteRoleRequestDto) {
    return this.service.deleteRole(tenantId, dto);
  }
}
