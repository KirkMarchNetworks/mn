import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, Pagination, TenantId } from '@mn/project-one/server/decorators';
import { CreateIntelligentRetrievalEventRequestDto } from './dtos/create-intelligent-retrieval-event-request.dto';
import { EventService } from './event.service';
import { IntelligentRetrievalEventEntity } from './entities/intelligent-retrieval-event.entity';
import { PaginationInterface, UserEntitySearchable } from '@mn/project-one/shared/sort-search-page';

const routes = ServerRouting.intelligentRetrieval.children.events.children;

@ApiTags(`
  ${ServerRouting.intelligentRetrieval.capitalizedPath} /
  ${ServerRouting.intelligentRetrieval.children.events.capitalizedPath}
`)
@Auth()
@Controller(ServerRouting.intelligentRetrieval.children.events.absolutePath())
export class EventController {

  constructor(private service: EventService) {}

  @ApiPaginatedResponse(IntelligentRetrievalEventEntity)
  @ApiOperation({ description: `Get all the Intelligent Retrieval Events for a tenant.`})
  @Get()
  async findAll(
    @TenantId() tenantId: string,
    @Pagination({
      ...UserEntitySearchable
    }) dto: PaginationInterface
  ) {
    return this.service.findAllPaginated(tenantId, dto);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Create a new Intelligent Retrieval Event.` })
  @Post(routes.create.path)
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateIntelligentRetrievalEventRequestDto
  ) {
    return this.service.createEvent(tenantId, dto);
  }
}
