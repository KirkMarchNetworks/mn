import { Module } from '@nestjs/common';
import { SearchQueryController } from './search-query.controller';
import { SearchQueryService } from './search-query.service';
import { IntelligentRetrievalRepoModule } from '@mn/project-one/server/repos/intelligent-retrieval';
import { EmbeddingModule } from '@mn/project-one/server/modules/embedding';

@Module({
  controllers: [SearchQueryController],
  providers: [SearchQueryService],
  imports: [
    EmbeddingModule,
    IntelligentRetrievalRepoModule
  ]
})
export class SearchQueryModule {}
