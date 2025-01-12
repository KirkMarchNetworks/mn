import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionRepoModule } from '@mn/project-one/server/repos/permission';

@Module({
  imports: [PermissionRepoModule],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
