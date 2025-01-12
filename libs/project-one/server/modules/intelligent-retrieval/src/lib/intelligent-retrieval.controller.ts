import { Body, Controller, Get, Param, Post, Headers, Req, Res, StreamableFile, UploadedFile } from '@nestjs/common';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IntelligentRetrievalService } from './intelligent-retrieval.service';
import {
  ApiFileResponse,
  ApiImageFile,
  ApiPaginatedResponse, Pagination,
  TenantId, TusHeader,
  TusUploadHttp
} from '@mn/project-one/server/decorators';
import { Request, Response } from 'express';
import { SearchRequestDto } from './dtos/search-request.dto';
import { UserEntity } from '@mn/project-one/server/entities';
import {
  ChannelImageWithDistanceEntitySearchable,
  PaginationInterface,
  UserEntitySearchable
} from '@mn/project-one/shared/sort-search-page';
import { ChannelImageEntity } from './entities/channel-image.entity';
import { SearchQuery, SearchQueryType } from './decorators/search-query.decorator';
import { CreateSearchTextQueryRequestDto } from './dtos/create-search-text-query-request.dto';
import { ChannelImageWithDistanceEntity } from './entities/channel-image-with-distance.entity';
import { UpdateSettingsRequestDto } from './dtos/update-settings-request.dto';

@ApiTags(ServerRouting.intelligentRetrieval.capitalizedPath)
@Auth()
@Controller(ServerRouting.intelligentRetrieval.path)
export class IntelligentRetrievalController {
  constructor(
    private service: IntelligentRetrievalService
  ) {}

  @ApiPaginatedResponse(ChannelImageWithDistanceEntity)
  @ApiOperation({ description: `Get all channel images.`})
  @Get()
  async findAll(
    @TenantId() tenantId: string,
    @Pagination({
      ...ChannelImageWithDistanceEntitySearchable
    }) dto: PaginationInterface,
    @SearchQuery() searchQuery: SearchQueryType
  ) {
    return this.service.findAllPaginated(tenantId, searchQuery, dto);
  }

  @Permissions(PermissionNames.ViewImage)
  @ApiOperation({ description: `View an uploaded image.`})
  @ApiFileResponse('image/*')
  @Get(`${ServerRouting.intelligentRetrieval.children.getImage.path}/:fileName`)
  getImage(@TenantId() tenantId: string, @Param('fileName') fileName: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    return this.service.getImage(tenantId, fileName, res);
  }

  @Permissions(PermissionNames.UploadImage)
  @ApiOperation({ description: `Create a search query from text.`})
  @Get(ServerRouting.intelligentRetrieval.children.getSearchQueries.path)
  getSearchQueries(@TenantId() tenantId: string) {
    return this.service.getSearchQueries(tenantId);
  }

  @Permissions(PermissionNames.UploadImage)
  @ApiOperation({ description: `Create a search query from text.`})
  @Post(ServerRouting.intelligentRetrieval.children.createSearchQuery.path)
  createSearchTextQuery(@TenantId() tenantId: string, @Body() dto: CreateSearchTextQueryRequestDto) {
    return this.service.createSearchTextQuery(tenantId, dto);
  }

  @Permissions(PermissionNames.UploadImage)
  @ApiOperation({ description: `Upload an image so that it can later be searched via vectors.`})
  @ApiImageFile()
  @Post(ServerRouting.intelligentRetrieval.children.upload.path)
  upload(@TenantId() tenantId: string, @UploadedFile() file: Express.Multer.File) {
    return this.service.upload(tenantId, file);
  }

  @Permissions(PermissionNames.UploadImage)
  @TusUploadHttp(ServerRouting.intelligentRetrieval.children.multiUpload.path)
  @ApiOperation({ description: `Upload images so that it they can later be searched via vectors.`})
  multiUpload(@TusHeader() tusHeader: string, @Req() req: Request, @Res() res: Response) {
    return this.service.multiUpload(tusHeader, req, res);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Search all images via a text search.`})
  @Post(ServerRouting.intelligentRetrieval.children.textSearch.path)
  textSearch(@TenantId() tenantId: string, @Body() dto: SearchRequestDto) {
    return this.service.textSearch(tenantId, dto);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Search all images via an uploaded image.`})
  @ApiImageFile()
  @Post(ServerRouting.intelligentRetrieval.children.imageSearch.path)
  imageSearch(@TenantId() tenantId: string, @UploadedFile() file: Express.Multer.File) {
    return this.service.imageSearch(tenantId, file);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Get current image count.`})
  @Get(ServerRouting.intelligentRetrieval.children.imageCount.path)
  getImageCount(@TenantId() tenantId: string) {
    return this.service.getImageCount(tenantId);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Get the settings of Intelligent Retrieval.`})
  @Get(ServerRouting.intelligentRetrieval.children.settings.path)
  getSettings(@TenantId() tenantId: string) {
    return this.service.getSettings(tenantId);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Update the settings of Intelligent Retrieval.`})
  @Post(ServerRouting.intelligentRetrieval.children.settings.path)
  updateSettings(@TenantId() tenantId: string, @Body() dto: UpdateSettingsRequestDto) {
    return this.service.updateSettings(tenantId, dto);
  }
}
