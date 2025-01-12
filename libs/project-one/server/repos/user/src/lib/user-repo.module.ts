import { Module } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';
import { SharedRepoModule } from '@mn/project-one/server/repos/shared';

@Module({
  imports: [
    RepoOneModule,
    SharedRepoModule
  ],
  providers: [UserRepo],
  exports: [UserRepo],
})
export class UserRepoModule {}
