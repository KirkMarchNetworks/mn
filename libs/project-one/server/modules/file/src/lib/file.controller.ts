import { Controller, Req, Res, Delete, Get, Head, Options, Patch, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthAndPermissions } from '@mn/project-one/server/guards';
import { FileService } from './file.service';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { tusFileEndpoint } from '@mn/project-one/server/models';
import { TestRequestDto } from './dtos/test-request.dto';
import { TenantId, UserId } from '@mn/project-one/server/decorators';

@ApiTags(ServerRouting.file.capitalizedPath)
@AuthAndPermissions(PermissionNames.Upload)
@Controller(tusFileEndpoint.controllerEndpoint)
export class FileController {

  static TUS_DESCRIPTION = `The use of this method directly is unsupported, this is solely used as a proxy to the tus server.`;

  constructor(
    private fileService: FileService,
  ) {
  }

  @ApiOperation({ description: 'Upload an external file via an external URL.' })
  @Post('external-upload')
  async externalUpload(@TenantId() tenantId: string, @UserId() userId: string, @Body() dto: TestRequestDto) {
    return await this.fileService.externalUpload(tenantId, userId, dto);
  }

  @Post(tusFileEndpoint.methodEndpoint)
  @ApiOperation({ description: FileController.TUS_DESCRIPTION })
  async tusPost(@Req() req: Request, @Res() res: Response) {
    return await this.fileService.multiUpload(req, res);
  }

  @Get(tusFileEndpoint.methodEndpoint)
  @ApiOperation({ description: FileController.TUS_DESCRIPTION })
  async tusGet(@Req() req: Request, @Res() res: Response) {
    return await this.fileService.multiUpload(req, res);
  }

  @Patch(tusFileEndpoint.methodEndpoint)
  @ApiOperation({ description: FileController.TUS_DESCRIPTION })
  async tusPatch(@Req() req: Request, @Res() res: Response) {
    return await this.fileService.multiUpload(req, res);
  }

  @Head(tusFileEndpoint.methodEndpoint)
  @ApiOperation({ description: FileController.TUS_DESCRIPTION })
  async tusHead(@Req() req: Request, @Res() res: Response) {
    return await this.fileService.multiUpload(req, res);
  }

  @Options(tusFileEndpoint.methodEndpoint)
  @ApiOperation({ description: FileController.TUS_DESCRIPTION })
  async tusOptions(@Req() req: Request, @Res() res: Response) {
    return await this.fileService.multiUpload(req, res);
  }

  @Delete(tusFileEndpoint.methodEndpoint)
  @ApiOperation({ description: FileController.TUS_DESCRIPTION })
  async tusDelete(@Req() req: Request, @Res() res: Response) {
    return await this.fileService.multiUpload(req, res);
  }
}
