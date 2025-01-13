import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { SuperAdminRoleId, ServerRouting } from '@mn/project-one/shared/models';
import { AuthAndRole } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTenantRequestDto } from './dtos/create-tenant-request.dto';
import { DeleteTenantRequestDto } from './dtos/delete-tenant-request.dto';
import { CreateTenantWithDefaultsRequestDto } from './dtos/create-tenant-with-defaults-request.dto';
import { ApiPaginatedResponse, Pagination, TenantId } from '@mn/project-one/server/decorators';
import { PaginationInterface, UserEntitySearchable } from '@mn/project-one/shared/sort-search-page';
import { TenantEntity } from './entities/tenant.entity';

@ApiTags(ServerRouting.tenant.capitalizedPath)
@AuthAndRole(SuperAdminRoleId)
@Controller(ServerRouting.tenant.absolutePath())
export class TenantController {
  constructor(
    private tenantService: TenantService
  ) {}

  @ApiOperation({ description: `Get all the tenants.`})
  @Get('test')
  async getTest (
  ): Promise<TenantEntity> {
    return {
      name: 'test',
      email: 'test',
      licenses: [],
      id: 'test'
    };
  }

  @ApiPaginatedResponse(TenantEntity)
  @ApiOperation({ description: `Get all the tenants.`})
  @Get()
  async getAll(
    @Pagination({
      ...UserEntitySearchable
    }) dto: PaginationInterface
  ) {
    return this.tenantService.findAllPaginated(dto);
  }

  @ApiOperation({ description: `Create a new tenant.` })
  @Post(ServerRouting.tenant.children.create.path)
  create(@Body() dto: CreateTenantRequestDto) {
    return this.tenantService.createTenant(dto);
  }

  @ApiOperation({ description: `Create a new tenant with default roles and an EV license.` })
  @Post(ServerRouting.tenant.children.createWithDefaults.path)
  createWithDefaultRoles(@Body() dto: CreateTenantWithDefaultsRequestDto) {
    return this.tenantService.createTenantWithDefaults(dto);
  }

  @ApiOperation({ description: `Delete a tenant.` })
  @Delete(ServerRouting.tenant.children.delete.path)
  delete(@Body() dto: DeleteTenantRequestDto) {
    return this.tenantService.deleteTenant(dto);
  }
}
