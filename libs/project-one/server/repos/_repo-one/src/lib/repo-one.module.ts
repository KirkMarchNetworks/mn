import { Module } from '@nestjs/common';
import { RepoOneService } from './repo-one.service';

@Module({
  controllers: [],
  providers: [RepoOneService],
  exports: [RepoOneService],
})
export class RepoOneModule {}
