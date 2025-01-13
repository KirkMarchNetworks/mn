import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { IntelligentRetrievalRepoModule } from '@mn/project-one/server/repos/intelligent-retrieval';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [
    IntelligentRetrievalRepoModule
  ]
})
export class SettingsModule {}
