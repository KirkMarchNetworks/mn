import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepoModule } from '@mn/project-one/server/repos/role';
import { PermissionRepoModule } from '@mn/project-one/server/repos/permission';
import { SharedRepoModule } from '@mn/project-one/server/repos/shared';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
  imports: [
    RoleRepoModule,
    SharedRepoModule,
    PermissionRepoModule,
  ],
})
export class RoleModule {}
