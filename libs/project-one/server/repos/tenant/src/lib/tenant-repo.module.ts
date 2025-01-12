import { Module } from '@nestjs/common';
import { TenantRepo } from './tenant.repo';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';

@Module({
  imports: [RepoOneModule],
  providers: [TenantRepo],
  exports: [TenantRepo],
})
export class TenantRepoModule {}
