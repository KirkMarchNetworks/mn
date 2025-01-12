import { Module } from '@nestjs/common';
import { DeviceAndChannelController } from './device-and-channel.controller';
import { DeviceAndChannelService } from './device-and-channel.service';
import { DeviceAndChannelRepoModule } from '@mn/project-one/server/repos/device-and-channel';

@Module({
  controllers: [DeviceAndChannelController],
  providers: [DeviceAndChannelService],
  exports: [DeviceAndChannelService],
  imports: [
    DeviceAndChannelRepoModule
  ]
})
export class DeviceAndChannelModule {}
