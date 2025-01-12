import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';

@Module({
  controllers: [],
  providers: [EmbeddingService],
  exports: [EmbeddingService],
})
export class EmbeddingModule {}
