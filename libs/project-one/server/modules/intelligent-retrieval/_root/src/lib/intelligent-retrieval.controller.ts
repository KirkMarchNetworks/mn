import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IntelligentRetrievalService } from './intelligent-retrieval.service';
import {
  ApiFileResponse,
  ApiPaginatedResponse,
  Pagination,
  TenantId,
} from '@mn/project-one/server/decorators';
import { Response } from 'express';
import {
  ChannelImageWithDistanceEntitySearchable,
  PaginationInterface,
} from '@mn/project-one/shared/sort-search-page';
import {
  SearchQuery,
  SearchQueryType,
} from './decorators/search-query.decorator';
import { ChannelImageWithDistanceEntity } from './entities/channel-image-with-distance.entity';

@ApiTags(ServerRouting.intelligentRetrieval.capitalizedPath)
@Auth()
@Controller(ServerRouting.intelligentRetrieval.absolutePath())
export class IntelligentRetrievalController {
  constructor(private service: IntelligentRetrievalService) {}

  @ApiPaginatedResponse(ChannelImageWithDistanceEntity)
  @ApiOperation({ description: `Get all channel images.` })
  @Get()
  async findAll(
    @TenantId() tenantId: string,
    @Pagination({
      ...ChannelImageWithDistanceEntitySearchable,
    })
    dto: PaginationInterface,
    @SearchQuery() searchQuery: SearchQueryType
  ) {
    return this.service.findAllPaginated(tenantId, searchQuery, dto);
  }

  @Permissions(PermissionNames.ViewImage)
  @ApiOperation({ description: `View an uploaded image.` })
  @ApiFileResponse('image/*')
  @Get(`${ServerRouting.intelligentRetrieval.children.getImage.path}/:fileName`)
  getImage(
    @TenantId() tenantId: string,
    @Param('fileName') fileName: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    return this.service.getImage(tenantId, fileName, res);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Get current image count.` })
  @Get(ServerRouting.intelligentRetrieval.children.imageCount.path)
  getImageCount(@TenantId() tenantId: string) {
    return this.service.getImageCount(tenantId);
  }
}
