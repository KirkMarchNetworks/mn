import { Module } from '@nestjs/common';
import { IntelligentRetrievalService } from './intelligent-retrieval.service';
import { IntelligentRetrievalController } from './intelligent-retrieval.controller';
import { FileModule } from '@mn/project-one/server/modules/file';
import { QueueModule } from '@mn/project-one/server/modules/queue';
import { ImageVectorQueueName, VectorImageProcessor } from './processors/vector-image.processor';
import { EmbeddingModule } from '@mn/project-one/server/modules/embedding';
import { FileUploadedListener } from './listeners/file-uploaded.listener';
import { IntelligentRetrievalRepoModule } from '@mn/project-one/server/repos/intelligent-retrieval';

@Module({
  controllers: [IntelligentRetrievalController],
  providers: [
    IntelligentRetrievalService,

    FileUploadedListener,

    VectorImageProcessor
  ],
  exports: [IntelligentRetrievalService],
  imports: [
    FileModule,
    IntelligentRetrievalRepoModule,

    EmbeddingModule,
    QueueModule.registerQueue(ImageVectorQueueName)
  ]
})
export class IntelligentRetrievalModule {
}
