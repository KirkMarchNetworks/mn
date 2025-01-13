import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { IntelligentRetrievalRepo } from '@mn/project-one/server/repos/intelligent-retrieval';
import { FileService } from '@mn/project-one/server/modules/file';
import { convertFileNameToStoragePath } from '../models/convert-file-name-to-storage-path';
import {
  EmbeddingService,
  TitanEmbeddingMultiModelV1Interface,
} from '@mn/project-one/server/modules/embedding';
import { convertImageStreamToBase64 } from '../models/convert-image-to-base64';
import { ChannelImageWithTenantType } from '../models/channel-image-with-tenant.type';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

export const ImageVectorQueueName = 'ImageVectorQueue';

export const InjectImageVectorQueue = (): ParameterDecorator =>
  InjectQueue(ImageVectorQueueName);

export type ImageVectorQueueType = Queue<
  ChannelImageWithTenantType,
  boolean,
  string
>;
export type ImageVectorJobType = Job<
  ChannelImageWithTenantType,
  boolean,
  string
>;

@Processor(ImageVectorQueueName, {
  concurrency: 3,
})
export class VectorImageProcessor extends WorkerHost {
  private readonly logger = new Logger(VectorImageProcessor.name);

  constructor(
    private fileService: FileService,
    private embeddingService: EmbeddingService,
    private repo: IntelligentRetrievalRepo
  ) {
    super();
  }

  async process(job: ImageVectorJobType) {
    const { tenantId, id, fileName } = job.data;

    const path = convertFileNameToStoragePath(tenantId, fileName);

    const file = await this.fileService.getObject(path, 'imageBucket');

    if (file) {
      const inputImage = await convertImageStreamToBase64(file.body);

      const res = await this.embeddingService.getImageEmbedding(inputImage);

      if (res) {
        await this.repo.addVectorToImage(id, res.embedding);
      } else {
        throw new Error('');
      }
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Active ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Completed ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.log(`Failed ${job.id}`);
  }
}
