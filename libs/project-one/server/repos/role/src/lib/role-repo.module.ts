import { Module } from '@nestjs/common';
import { RoleRepo } from './role.repo';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';

@Module({
  imports: [RepoOneModule],
  providers: [RoleRepo],
  exports: [RoleRepo],
})
export class RoleRepoModule {}
