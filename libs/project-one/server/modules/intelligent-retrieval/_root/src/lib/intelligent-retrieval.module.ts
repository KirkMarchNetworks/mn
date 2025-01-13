import { Module } from '@nestjs/common';
import { IntelligentRetrievalService } from './intelligent-retrieval.service';
import { IntelligentRetrievalController } from './intelligent-retrieval.controller';
import { FileModule } from '@mn/project-one/server/modules/file';
import { IntelligentRetrievalRepoModule } from '@mn/project-one/server/repos/intelligent-retrieval';
import { EventModule } from '@mn/project-one/server/modules/intelligent-retrieval/event';
import { SearchQueryModule } from '@mn/project-one/server/modules/intelligent-retrieval/search-query';
import { UploadModule } from '@mn/project-one/server/modules/intelligent-retrieval/upload';
import { SettingsModule } from '@mn/project-one/server/modules/intelligent-retrieval/settings';

@Module({
  controllers: [IntelligentRetrievalController],
  providers: [IntelligentRetrievalService],
  exports: [IntelligentRetrievalService],
  imports: [
    FileModule,
    IntelligentRetrievalRepoModule,

    EventModule,
    SearchQueryModule,
    UploadModule,
    SettingsModule
  ],
})
export class IntelligentRetrievalModule {}
