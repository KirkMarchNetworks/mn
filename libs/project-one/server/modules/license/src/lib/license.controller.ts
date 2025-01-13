import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServerRouting, SuperAdminRoleId } from '@mn/project-one/shared/models';
import { Auth, Role } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEvLicenseRequestDto } from './dtos/create-ev-license-request.dto';
import { TenantId } from '@mn/project-one/server/decorators';
import { LicenseService } from './license.service';

@ApiTags(ServerRouting.license.capitalizedPath)
@Auth()
@Controller(ServerRouting.license.absolutePath())
export class LicenseController {
  constructor(
    private service: LicenseService
  ) {
  }

  @ApiOperation({ description: `Gets all licensed products for a tenant.` })
  @Get()
  getLicenses(@TenantId() tenantId: string) {
    return this.service.getLicenses(tenantId);
  }

  @Role(SuperAdminRoleId)
  @ApiOperation({ description: `Create a new ev licensed product.` })
  @Post(ServerRouting.license.children.addEvLicense.path)
  addEvLicense(@Body() dto: CreateEvLicenseRequestDto) {
    return this.service.addEvLicense(dto);
  }
}
