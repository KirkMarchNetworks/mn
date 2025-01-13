import { Controller, Req, Res } from '@nestjs/common';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { TusHeader, TusUploadHttp } from '@mn/project-one/server/decorators';
import { Request, Response } from 'express';

@ApiTags(`
  ${ServerRouting.intelligentRetrieval.capitalizedPath} /
  ${ServerRouting.intelligentRetrieval.children.upload.capitalizedPath}
`)
@Auth()
@Controller(ServerRouting.intelligentRetrieval.absolutePath())
export class UploadController {
  constructor(private service: UploadService) {}

  @Permissions(PermissionNames.UploadImage)
  @TusUploadHttp(ServerRouting.intelligentRetrieval.children.upload.path)
  @ApiOperation({
    description: `Upload images so that it they can later be searched via vectors.`,
  })
  upload(
    @TusHeader() tusHeader: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.service.upload(tusHeader, req, res);
  }
}
