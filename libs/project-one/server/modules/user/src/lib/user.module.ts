import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepoModule } from '@mn/project-one/server/repos/user';
import { FileModule } from '@mn/project-one/server/modules/file';

@Module({
  imports: [
    UserRepoModule,
    FileModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService,
  ],
})
export class UserModule {}
