import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantId } from '@mn/project-one/server/decorators';
import { SettingsService } from './settings.service';
import { UpdateSettingsRequestDto } from './dtos/update-settings-request.dto';

const routes = ServerRouting.intelligentRetrieval.children.settings.children;

@ApiTags(`
  ${ServerRouting.intelligentRetrieval.capitalizedPath} /
  ${ServerRouting.intelligentRetrieval.children.settings.capitalizedPath}
`)
@Auth()
@Controller(ServerRouting.intelligentRetrieval.children.settings.absolutePath())
export class SettingsController {

  constructor(private service: SettingsService) {}

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Get the settings of Intelligent Retrieval.` })
  @Get()
  getSettings(@TenantId() tenantId: string) {
    return this.service.getSettings(tenantId);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({
    description: `Upsert the base settings of Intelligent Retrieval.`,
  })
  @Post(routes.upsert.path)
  upsertSettings(
    @TenantId() tenantId: string,
    @Body() dto: UpdateSettingsRequestDto
  ) {
    return this.service.upsertSettings(tenantId, dto);
  }
}
