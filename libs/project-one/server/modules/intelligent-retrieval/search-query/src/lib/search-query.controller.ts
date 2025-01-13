import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantId } from '@mn/project-one/server/decorators';
import { SearchQueryService } from './search-query.service';
import { CreateSearchTextQueryRequestDto } from './dtos/create-search-text-query-request.dto';

const routes = ServerRouting.intelligentRetrieval.children.searchQuery.children;

@ApiTags(`
  ${ServerRouting.intelligentRetrieval.capitalizedPath} /
  ${ServerRouting.intelligentRetrieval.children.searchQuery.capitalizedPath}
`)
@Auth()
@Controller(ServerRouting.intelligentRetrieval.children.searchQuery.absolutePath())
export class SearchQueryController {

  constructor(private service: SearchQueryService) {}

  @Permissions(PermissionNames.UploadImage)
  @ApiOperation({ description: `Create a search query from text.` })
  @Get()
  getSearchQueries(@TenantId() tenantId: string) {
    return this.service.getSearchQueries(tenantId);
  }

  @Permissions(PermissionNames.UploadImage)
  @ApiOperation({ description: `Create a search query from text.` })
  @Post(routes.create.path)
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateSearchTextQueryRequestDto
  ) {
    return this.service.createSearchTextQuery(tenantId, dto);
  }
}
