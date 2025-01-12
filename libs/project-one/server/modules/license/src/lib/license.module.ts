import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { LicenseRepoModule } from '@mn/project-one/server/repos/license';

@Module({
  imports: [LicenseRepoModule],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService],
})
export class LicenseModule {}
