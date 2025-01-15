import { Injectable } from '@nestjs/common';
import { IntelligentRetrievalRepo } from '@mn/project-one/server/repos/intelligent-retrieval';
import { CreateIntelligentRetrievalEventRequestDto } from './dtos/create-intelligent-retrieval-event-request.dto';
import { IntelligentRetrievalEventEntity } from './entities/intelligent-retrieval-event.entity';
import { PaginationInterface } from '@mn/project-one/shared/sort-search-page';
import { PaginatedDto } from '@mn/project-one/server/dtos';
import { paginationExtractor } from '@mn/project-one/server/models';

@Injectable()
export class EventService {
  constructor(private repo: IntelligentRetrievalRepo) {}

  async findAllPaginated(
    tenantId: string,
    pagination: PaginationInterface
  ): Promise<PaginatedDto<IntelligentRetrievalEventEntity>> {
    const params = paginationExtractor(pagination);

    const totalCount = await this.repo.getEventCountForTenant(tenantId, params);

    const results = await this.repo.getEventsForTenant(tenantId, params);

    const p = new PaginatedDto<IntelligentRetrievalEventEntity>();
    p.take = params.take;
    p.skip = params.skip;
    p.total = totalCount;
    p.results = results;
    return p;
  }

  async createEvent(
    tenantId: string,
    dto: CreateIntelligentRetrievalEventRequestDto
  ): Promise<IntelligentRetrievalEventEntity> {
    const foundQuery = await this.repo.findPreviousQueryId(
      tenantId,
      dto.searchQueryId
    );

    if (!foundQuery) {
      throw new Error('Cannot find the query.');
    }

    const { name, similarityScore } = dto;

    return await this.repo.createEvent(
      tenantId,
      foundQuery.id,
      name,
      similarityScore
    );
  }
}
