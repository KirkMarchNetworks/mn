import { Injectable } from '@nestjs/common';
import { FileService } from '@mn/project-one/server/modules/file';
import { Request, Response } from 'express';
import { MultiUploadRequest } from '@mn/project-one/server/models';
import { intelligentRetrievalParse } from '@mn/project-one/shared/models';
import { MultiUploadRootName } from './models/multi-upload-root-name';

@Injectable()
export class UploadService {
  constructor(private fileService: FileService) {}

  upload(tusHeader: string, req: Request, res: Response) {
    const data = intelligentRetrievalParse(tusHeader);

    console.log(data);

    if (!data) {
      throw new Error('Does not contain correct data');
    }

    // TODO: We can validate that the data.channelId exists for current tenant

    return this.fileService.multiUpload(
      req,
      res,
      new MultiUploadRequest({
        uploadName: MultiUploadRootName,
        metaData: {
          ...data,
        },
      })
    );
  }
}

