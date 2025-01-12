import { Injectable } from '@nestjs/common';
import { RepoOneService } from '@mn/project-one/server/repos/repo-one';
import { deviceSelect } from './types/device.type';
import { channelSelect } from './types/channel.type';

@Injectable()
export class DeviceAndChannelRepo {
  constructor(
    private repoOneService: RepoOneService
  ) {
  }

  async getAllDevicesAndChannels(tenantId: string) {

    const devices = await this.repoOneService.device.findMany({
      where: {
        tenantId
      },
      select: deviceSelect
    });

    const channels = await this.repoOneService.channel.findMany({
      where: {
        device: {
          tenantId
        }
      },
      select: channelSelect
    });

    return {
      devices,
      channels
    }
  }

  async findDevice(tenantId: string, deviceId: string) {
    return await this.repoOneService.device.findFirst({
      where: {
        id: deviceId,
        tenantId,
      },
      select: {
        id: true
      }
    })
  }

  async createDevice(tenantId: string, name: string) {
    return await this.repoOneService.device.create({
      data: {
        tenantId,
        name
      },
      select: deviceSelect
    })
  }

  async createChannel(deviceId: string, name: string) {
    return await this.repoOneService.channel.create({
      data: {
        deviceId,
        name
      },
      select: channelSelect
    })
  }
}
