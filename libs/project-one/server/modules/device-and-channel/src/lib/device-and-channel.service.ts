import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dtos/create-request.dto';
import { DeviceAndChannelRepo } from '@mn/project-one/server/repos/device-and-channel';
import { CreateChannelRequestDto } from './dtos/create-channel-request.dto';
import { GetAllDevicesAndChannelsResponseDto } from './dtos/get-all-devices-and-channels-response.dto';
import { Channel2Entity } from './entities/channel2.entity';
import { Device2Entity } from './entities/device2.entity';

@Injectable()
export class DeviceAndChannelService {
  constructor(
    private repo: DeviceAndChannelRepo
  ) {
  }

  async getAllDevicesAndChannels(tenantId: string): Promise<GetAllDevicesAndChannelsResponseDto> {
    return await this.repo.getAllDevicesAndChannels(tenantId);
  }

  async createDevice(tenantId: string, { name }: CreateRequestDto): Promise<Device2Entity> {
    return await this.repo.createDevice(tenantId, name);
  }

  async createChannel(tenantId: string, { deviceId, name }: CreateChannelRequestDto): Promise<Channel2Entity> {
    const doesDeviceExist = await this.repo.findDevice(tenantId, deviceId);

    if (doesDeviceExist) {
      return await this.repo.createChannel(deviceId, name);
    }

    throw new Error('Unknown device.');
  }
}
