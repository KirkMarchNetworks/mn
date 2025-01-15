import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { FileModule } from '@mn/project-one/server/modules/file';
import { QueueModule } from '@mn/project-one/server/modules/queue';
import {
  VectorizeImageQueueName,
  VectorizeImageProcessor,
} from './processors/vectorize-image.processor';
import { EmbeddingModule } from '@mn/project-one/server/modules/embedding';
import { FileUploadedListener } from './listeners/file-uploaded.listener';
import { IntelligentRetrievalRepoModule } from '@mn/project-one/server/repos/intelligent-retrieval';
import { SharedModule } from '@mn/project-one/server/modules/intelligent-retrieval/shared';

@Module({
  controllers: [UploadController],
  providers: [UploadService, FileUploadedListener, VectorizeImageProcessor],
  exports: [UploadService],
  imports: [
    SharedModule,
    FileModule,
    IntelligentRetrievalRepoModule,

    EmbeddingModule,
    QueueModule.registerQueue(VectorizeImageQueueName),
  ],
})
export class UploadModule {}
