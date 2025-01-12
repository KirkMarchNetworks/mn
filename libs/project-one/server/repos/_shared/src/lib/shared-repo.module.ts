import { Module } from '@nestjs/common';
import { SharedRepo } from './shared.repo';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';

@Module({
  imports: [RepoOneModule],
  providers: [SharedRepo],
  exports: [SharedRepo],
})
export class SharedRepoModule {}
