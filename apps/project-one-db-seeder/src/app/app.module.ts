import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';
import { TenantModule } from '@mn/project-one/server/modules/tenant';
import { UserModule } from '@mn/project-one/server/modules/user';
import { RoleModule } from '@mn/project-one/server/modules/role';

@Module({
  imports: [RepoOneModule, TenantModule, UserModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
