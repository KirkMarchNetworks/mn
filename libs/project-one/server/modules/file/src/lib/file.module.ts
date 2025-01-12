import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { SimpleStorageModule } from '@mn/project-one/server/modules/simple-storage';
import { FileController } from './file.controller';
import { TusModule } from '@mn/project-one/server/modules/tus';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
  imports: [
    TusModule,
    SimpleStorageModule,
  ]
})
export class FileModule {}
