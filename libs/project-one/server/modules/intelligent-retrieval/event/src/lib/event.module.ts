import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { IntelligentRetrievalRepoModule } from '@mn/project-one/server/repos/intelligent-retrieval';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [
    IntelligentRetrievalRepoModule
  ]
})
export class EventModule {}
