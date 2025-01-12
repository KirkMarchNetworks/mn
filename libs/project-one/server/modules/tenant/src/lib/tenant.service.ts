import { Injectable } from '@nestjs/common';
import { PaginatedDto, SimpleResponseDto } from '@mn/project-one/server/dtos';
import { TenantRepo } from '@mn/project-one/server/repos/tenant';
import { CreateTenantRequestDto } from './dtos/create-tenant-request.dto';
import { DeleteTenantRequestDto } from './dtos/delete-tenant-request.dto';
import { CreateTenantResponseDto } from './dtos/create-tenant-response.dto';
import { CreateTenantWithDefaultsResponseDto } from './dtos/create-tenant-with-defaults-response.dto';
import { RoleService } from '@mn/project-one/server/modules/role';
import { LicenseService } from '@mn/project-one/server/modules/license';
import { CreateTenantWithDefaultsRequestDto } from './dtos/create-tenant-with-defaults-request.dto';
import { PaginationInterface } from '@mn/project-one/shared/sort-search-page';
import { UserEntity } from '@mn/project-one/server/entities';
import { paginationExtractor } from '@mn/project-one/server/models';
import { TenantEntity } from './entities/tenant.entity';

@Injectable()
export class TenantService {

  constructor(
    private repo: TenantRepo,
    private roleService: RoleService,
    private licenseService: LicenseService
  ) {
  }

  private _timeout() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  async findAllPaginated(pagination: PaginationInterface): Promise<PaginatedDto<TenantEntity>> {

    const params = paginationExtractor(pagination);

    const totalCount = await this.repo.getCount(params);
    const results = await this.repo.getTenants(params);

    const p = new PaginatedDto<TenantEntity>();
    p.take = params.take;
    p.skip = params.skip;
    p.total = totalCount;
    p.results = results;
    return p;
  }

  async createTenant({ name, email }: CreateTenantRequestDto): Promise<CreateTenantResponseDto> {
    return await this.repo.createTenant(name, email);
  }

  /**
   * Creates a new tenant with default roles and the default EV license
   * @param dto
   */
  async createTenantWithDefaults(dto: CreateTenantWithDefaultsRequestDto): Promise<CreateTenantWithDefaultsResponseDto> {
    const tenant = await this.createTenant(dto);

    const roles = await this.roleService.addDefaultRolesWithPermissions(tenant.id);

    const license = await this.licenseService.addEvLicense({
      ...dto.license,
      tenantId: tenant.id
    });

    return {
      ...tenant,
      roles,
      licenses: [ license ]
    };
  }

  async deleteTenant({ name }: DeleteTenantRequestDto): Promise<SimpleResponseDto> {
    let success = false;
    try {
      await this.repo.deleteTenant(name);
      success = true;
    } catch (e) {
      console.error(e);
    }
    return { success };
  }
}
