import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';

@Module({
  controllers: [HealthController],
  providers: [],
  imports: [
    TerminusModule,
    HttpModule,
    RepoOneModule
  ],
})
export class HealthModule {}
