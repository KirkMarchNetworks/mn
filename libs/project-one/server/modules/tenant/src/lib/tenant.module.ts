import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantRepoModule } from '@mn/project-one/server/repos/tenant';
import { RoleModule } from '@mn/project-one/server/modules/role';
import { LicenseModule } from '@mn/project-one/server/modules/license';

@Module({
  imports: [
    TenantRepoModule,
    RoleModule,
    LicenseModule
  ],
  controllers: [
    TenantController
  ],
  providers: [
    TenantService
  ],
})
export class TenantModule {}
