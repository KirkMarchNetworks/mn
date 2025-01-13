import { Controller, Get } from '@nestjs/common';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantId } from '@mn/project-one/server/decorators';

const routes = ServerRouting.intelligentRetrieval.children.events.children;

@ApiTags(`
  ${ServerRouting.intelligentRetrieval.capitalizedPath} /
  ${ServerRouting.intelligentRetrieval.children.events.capitalizedPath}
`)
@Auth()
@Controller(ServerRouting.intelligentRetrieval.children.events.absolutePath())
export class EventController {

  @Permissions(PermissionNames.UploadImage)
  @ApiOperation({ description: `Create a search query from text.` })
  @Get(routes.create.path)
  getSearchQueries(@TenantId() tenantId: string) {
    return 'test';
  }
}
