import { Injectable } from '@nestjs/common';
import { IntelligentRetrievalRepo } from '@mn/project-one/server/repos/intelligent-retrieval';
import { CreateIntelligentRetrievalEventRequestDto } from './dtos/create-intelligent-retrieval-event-request.dto';
import { IntelligentRetrievalEventEntity } from './entities/intelligent-retrieval-event.entity';

@Injectable()
export class EventService {
  constructor(private repo: IntelligentRetrievalRepo) {}

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

    return await this.repo.updateEvents(
      tenantId,
      foundQuery.id,
      name,
      similarityScore
    );
  }
}
