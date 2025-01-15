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
import {
  EmbeddingService,
} from '@mn/project-one/server/modules/embedding';

export const EventVectorQueueName = 'EventVectorQueue';

export const InjectEventVectorQueue = (): ParameterDecorator =>
  InjectQueue(EventVectorQueueName);

interface EventVectorInterface {
  tenantId: string;
  id: string;
  vector: number[]
}

export type EventVectorQueueType = Queue<
  EventVectorInterface,
  boolean,
  string
>;
export type EventVectorJobType = Job<
  EventVectorInterface,
  boolean,
  string
>;

@Processor(EventVectorQueueName, {
  concurrency: 3,
})
export class EventVectorProcessor extends WorkerHost {
  private readonly logger = new Logger(EventVectorProcessor.name);

  constructor(
    private fileService: FileService,
    private embeddingService: EmbeddingService,
    private repo: IntelligentRetrievalRepo
  ) {
    super();
  }

  async process(job: EventVectorJobType) {
    const { tenantId, id, vector } = job.data;

    const events = await this.repo.getAllEventsForTenant(tenantId);

    for (const event of events) {
      event.
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
