import { Module } from '@nestjs/common';
import { QueueModule } from '@mn/project-one/server/modules/queue';
import { EventVectorProcessor, EventVectorQueueName } from './processors/event-vector.processor';
import { IntelligentRetrievalRepoModule } from '@mn/project-one/server/repos/intelligent-retrieval';

@Module({
  providers: [
    EventVectorProcessor
  ],
  exports: [
    EventVectorProcessor
  ],
  imports: [
    IntelligentRetrievalRepoModule,
    QueueModule.registerQueue(EventVectorQueueName),
  ],
})
export class SharedModule {}
