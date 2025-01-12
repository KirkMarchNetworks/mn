import { Module } from '@nestjs/common';
import { SimpleStorageService } from './simple-storage.service';

@Module({
  controllers: [],
  providers: [SimpleStorageService],
  exports: [SimpleStorageService],
})
export class SimpleStorageModule {}
