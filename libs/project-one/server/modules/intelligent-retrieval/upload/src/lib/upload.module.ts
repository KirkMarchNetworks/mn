import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { FileModule } from '@mn/project-one/server/modules/file';
import { QueueModule } from '@mn/project-one/server/modules/queue';
import {
  ImageVectorQueueName,
  VectorImageProcessor,
} from './processors/vector-image.processor';
import { EmbeddingModule } from '@mn/project-one/server/modules/embedding';
import { FileUploadedListener } from './listeners/file-uploaded.listener';
import { IntelligentRetrievalRepoModule } from '@mn/project-one/server/repos/intelligent-retrieval';

@Module({
  controllers: [UploadController],
  providers: [UploadService, FileUploadedListener, VectorImageProcessor],
  exports: [UploadService],
  imports: [
    FileModule,
    IntelligentRetrievalRepoModule,

    EmbeddingModule,
    QueueModule.registerQueue(ImageVectorQueueName),
  ],
})
export class UploadModule {}
