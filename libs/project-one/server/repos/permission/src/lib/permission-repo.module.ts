import { Module } from '@nestjs/common';
import { PermissionRepo } from './permission.repo';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';

@Module({
  imports: [ RepoOneModule ],
  providers: [PermissionRepo],
  exports: [PermissionRepo],
})
export class PermissionRepoModule {}
