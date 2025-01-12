import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { IntelligentRetrievalRepo } from '@mn/project-one/server/repos/intelligent-retrieval';
import { FileService } from '@mn/project-one/server/modules/file';
import { convertFileNameToStoragePath } from '../models/convert-file-name-to-storage-path';
import { EmbeddingService, TitanEmbeddingMultiModelV1Interface } from '@mn/project-one/server/modules/embedding';
import { convertImageStreamToBase64 } from '../models/convert-image-to-base64';
import { ChannelImageWithTenantType } from '../models/channel-image-with-tenant.type';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

export const GenerativeModelUpdateQueueName = 'GenerativeModelUpdateQueue';

export const InjectGenerativeModelUpdateQueue = () =>
  InjectQueue(GenerativeModelUpdateQueueName);

export type GenerativeModelUpdateQueueType = Queue<ChannelImageWithTenantType, boolean, string>
export type GenerativeModelUpdateJobType = Job<ChannelImageWithTenantType, boolean, string>

@Processor(GenerativeModelUpdateQueueName, {
  concurrency: 3,
})
export class GenerativeModelUpdateProcessor extends WorkerHost {
  private readonly logger = new Logger(GenerativeModelUpdateProcessor.name);

  constructor(
    private fileService: FileService,
    private embeddingService: EmbeddingService,
    private repo: IntelligentRetrievalRepo
  ) {
    super();
  }

  async process(job: GenerativeModelUpdateJobType) {
    const { tenantId } = job.data;

    const count = await this.repo.getImageCount(tenantId);
    const timeNow = new Date();

    const rows = await this.repo.getChannelImages(tenantId, {
      where: {
        createdAt: {
          lte: timeNow
        }
      },
      take: count,
      skip: 0,
      orderBy: {
        createdAt: 'asc'
      },
    });

    for (const row of rows) {
      const path = convertFileNameToStoragePath(tenantId, row.fileName);

      const file = await this.fileService.getObject(path, 'imageBucket');

      if (file) {
        const inputImage = await convertImageStreamToBase64(file.body);

        const res = await this.embeddingService.getImageEmbedding(inputImage);

        if (res) {
          await this.repo.addVectorToImage(row.id, res.embedding);
        } else {
          throw new Error('')
        }
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
