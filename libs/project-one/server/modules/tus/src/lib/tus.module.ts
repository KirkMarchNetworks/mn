import { Module } from '@nestjs/common';
import { TusService } from './tus.service';

@Module({
  controllers: [],
  providers: [TusService],
  exports: [TusService],
})
export class TusModule {}
