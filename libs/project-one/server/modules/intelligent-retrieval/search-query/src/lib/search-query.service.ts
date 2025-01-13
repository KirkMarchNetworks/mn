import { Injectable } from '@nestjs/common';
import { IntelligentRetrievalRepo } from '@mn/project-one/server/repos/intelligent-retrieval';
import {
  embeddingForTheWordShoe,
  SearchQueryEntity
} from '@mn/project-one/server/modules/intelligent-retrieval/shared';
import { CreateSearchTextQueryRequestDto } from './dtos/create-search-text-query-request.dto';
import { EmbeddingService } from '@mn/project-one/server/modules/embedding';

@Injectable()
export class SearchQueryService {
  constructor(
    private embeddingService: EmbeddingService,
    private repo: IntelligentRetrievalRepo
  ) {}

  async getSearchQueries(tenantId: string): Promise<SearchQueryEntity[]> {
    return await this.repo.getSearchQueries(tenantId);
  }

  async createSearchTextQuery(
    tenantId: string,
    { query }: CreateSearchTextQueryRequestDto
  ): Promise<SearchQueryEntity> {
    const lowerCaseQuery = query.toLowerCase();

    const res = await this.embeddingService.getTextEmbedding(lowerCaseQuery);
    // const res = {
    //   embedding: embeddingForTheWordShoe
    // };

    if (res) {
      const queryId = await this.repo.saveSearchQuery({
        tenantId,
        vector: res.embedding,
        lowerCaseQuery,
        originalCaseQuery: query,
      });

      const createdQuery = await this.repo.getSearchQuery(queryId);

      if (createdQuery === null) {
        throw new Error('This should not occur');
      }

      return createdQuery;
    }

    throw new Error('Unable to create search query.');
  }

}
