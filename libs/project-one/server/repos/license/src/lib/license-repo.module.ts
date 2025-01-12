import { Module } from '@nestjs/common';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';
import { LicenseRepo } from './license.repo';

@Module({
  imports: [RepoOneModule],
  providers: [LicenseRepo],
  exports: [LicenseRepo],
})
export class LicenseRepoModule {}
