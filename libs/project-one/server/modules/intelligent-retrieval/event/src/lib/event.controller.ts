import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantId } from '@mn/project-one/server/decorators';
import { CreateIntelligentRetrievalEventRequestDto } from './dtos/create-intelligent-retrieval-event-request.dto';
import { EventService } from './event.service';

const routes = ServerRouting.intelligentRetrieval.children.events.children;

@ApiTags(`
  ${ServerRouting.intelligentRetrieval.capitalizedPath} /
  ${ServerRouting.intelligentRetrieval.children.events.capitalizedPath}
`)
@Auth()
@Controller(ServerRouting.intelligentRetrieval.children.events.absolutePath())
export class EventController {

  constructor(private service: EventService) {}

  @Permissions(PermissionNames.UploadImage)
  @ApiOperation({ description: `Create a search query from text.` })
  @Get(routes.create.path)
  get(@TenantId() tenantId: string) {
    return 'test';
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Create a new Intelligent Retrieval Event.` })
  @Post(ServerRouting.intelligentRetrieval.children.events.path)
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateIntelligentRetrievalEventRequestDto
  ) {
    return this.service.createEvent(tenantId, dto);
  }
}
