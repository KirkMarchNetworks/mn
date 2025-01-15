import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { IntelligentRetrievalRepoModule } from '@mn/project-one/server/repos/intelligent-retrieval';
import { SharedModule } from '@mn/project-one/server/modules/intelligent-retrieval/shared';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [
    SharedModule,
    IntelligentRetrievalRepoModule
  ]
})
export class EventModule {}
