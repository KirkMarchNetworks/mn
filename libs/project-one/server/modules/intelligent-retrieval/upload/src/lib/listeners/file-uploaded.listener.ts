import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FileUploadedEvent } from '@mn/project-one/server/events';
import { IntelligentRetrievalRepo } from '@mn/project-one/server/repos/intelligent-retrieval';
import {
  ImageVectorQueueType,
  InjectImageVectorQueue,
} from '../processors/vector-image.processor';
import {
  generateFileId,
  generateId,
  MultiUploadRequest,
} from '@mn/project-one/server/models';
import { FileService } from '@mn/project-one/server/modules/file';
import { convertFileNameToStoragePath } from '../models/convert-file-name-to-storage-path';
import { MultiUploadRootName } from '../models/multi-upload-root-name';
import { intelligentRetrievalParse } from '@mn/project-one/shared/models';

const multiUploadEventName = new MultiUploadRequest({
  uploadName: MultiUploadRootName,
}).getEventName();

@Injectable()
export class FileUploadedListener {
  constructor(
    private repo: IntelligentRetrievalRepo,
    private fileService: FileService,
    @InjectImageVectorQueue() private imageVectorQueue: ImageVectorQueueType
  ) {}

  @OnEvent(multiUploadEventName)
  async handleFileUploadedEvent({ params }: FileUploadedEvent) {
    const { tenantId, path, bucketName, originalName, customMetadata } =
      params.metadata;
    const fileName = generateFileId();

    await this.fileService.moveObject(
      bucketName,
      path,
      'imageBucket',
      convertFileNameToStoragePath(tenantId, fileName)
    );

    const data = intelligentRetrievalParse(customMetadata);

    if (data) {
      const entity = await this.repo.addImage(
        data.channelId,
        fileName,
        originalName
      );

      await this.imageVectorQueue.add(generateId(), {
        ...entity,
        tenantId,
      });

      return entity;
    }

    throw new Error('Error parsing metadata');
  }
}
