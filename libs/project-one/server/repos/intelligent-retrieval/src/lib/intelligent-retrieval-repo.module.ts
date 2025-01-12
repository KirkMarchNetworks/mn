import { Module } from '@nestjs/common';
import { IntelligentRetrievalRepo } from './intelligent-retrieval.repo';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';

@Module({
  imports: [RepoOneModule],
  providers: [IntelligentRetrievalRepo],
  exports: [IntelligentRetrievalRepo],
})
export class IntelligentRetrievalRepoModule {}
