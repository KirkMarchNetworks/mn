import { Module } from '@nestjs/common';
import { DeviceAndChannelRepo } from './device-and-channel.repo';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';

@Module({
  imports: [RepoOneModule],
  providers: [DeviceAndChannelRepo],
  exports: [DeviceAndChannelRepo]
})
export class DeviceAndChannelRepoModule {

}
