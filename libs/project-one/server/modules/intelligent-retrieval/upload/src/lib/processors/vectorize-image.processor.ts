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
} from '@mn/project-one/server/modules/embedding';
import { convertImageStreamToBase64 } from '../models/convert-image-to-base64';
import { ChannelImageWithTenantType } from '../models/channel-image-with-tenant.type';
import {
  EventVectorQueueType,
  InjectEventVectorQueue
} from '@mn/project-one/server/modules/intelligent-retrieval/shared';

export const VectorizeImageQueueName = 'VectorizeImageQueue';

export const InjectVectorizeImageQueue = (): ParameterDecorator =>
  InjectQueue(VectorizeImageQueueName);

export type VectorizeImageQueueType = Queue<
  ChannelImageWithTenantType,
  boolean,
  string
>;
export type VectorizeImageJobType = Job<
  ChannelImageWithTenantType,
  boolean,
  string
>;

@Processor(VectorizeImageQueueName, {
  concurrency: 3,
})
export class VectorizeImageProcessor extends WorkerHost {
  private readonly logger = new Logger(VectorizeImageProcessor.name);

  constructor(
    private fileService: FileService,
    private embeddingService: EmbeddingService,
    private repo: IntelligentRetrievalRepo,
    @InjectEventVectorQueue() private eventVectorQueue: EventVectorQueueType
  ) {
    super();
  }

  async process(job: VectorizeImageJobType) {
    const { tenantId, id, fileName } = job.data;

    const path = convertFileNameToStoragePath(tenantId, fileName);

    const file = await this.fileService.getObject(path, 'imageBucket');

    if (file) {
      const inputImage = await convertImageStreamToBase64(file.body);

      const res = await this.embeddingService.getImageEmbedding(inputImage);

      if (res) {
        await this.repo.addVectorToImage(id, res.embedding);
        this.eventVectorQueue.add()
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
