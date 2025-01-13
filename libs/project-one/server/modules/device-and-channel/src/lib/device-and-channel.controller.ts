import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeviceAndChannelService } from './device-and-channel.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { Auth, Permissions } from '@mn/project-one/server/guards';
import { TenantId } from '@mn/project-one/server/decorators';
import { CreateRequestDto } from './dtos/create-request.dto';
import { CreateChannelRequestDto } from './dtos/create-channel-request.dto';

@ApiTags(ServerRouting.deviceAndChannel.capitalizedPath)
@Auth()
@Controller(ServerRouting.deviceAndChannel.absolutePath())
export class DeviceAndChannelController {
  constructor(
    private service: DeviceAndChannelService
  ) {}

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Gets all the devices and channels for a tenant.`})
  @Get()
  getAllDevicesAndChannels(@TenantId() tenantId: string) {
    return this.service.getAllDevicesAndChannels(tenantId);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Add a device.`})
  @Post(ServerRouting.deviceAndChannel.children.createDevice.path)
  createDevice(@TenantId() tenantId: string, @Body() dto: CreateRequestDto) {
    return this.service.createDevice(tenantId, dto);
  }

  @Permissions(PermissionNames.SearchImage)
  @ApiOperation({ description: `Add a channel.`})
  @Post(ServerRouting.deviceAndChannel.children.createChannel.path)
  createChannel(@TenantId() tenantId: string, @Body() dto: CreateChannelRequestDto) {
    return this.service.createChannel(tenantId, dto);
  }
}
