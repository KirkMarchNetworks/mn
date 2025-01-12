import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class QueueModule {
  public static registerQueue(name: string): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.registerQueue({
          name,
        }),
        BullBoardModule.forFeature({
          name,
          adapter: BullMQAdapter,
        })
      ],
      exports: [
        BullModule.registerQueue({
          name,
        }),
        BullBoardModule.forFeature({
          name,
          adapter: BullMQAdapter,
        })
      ],
    }
  }
}
