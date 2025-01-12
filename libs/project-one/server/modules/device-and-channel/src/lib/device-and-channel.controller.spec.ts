import { Test } from '@nestjs/testing';
import { DeviceAndChannelController } from './device-and-channel.controller';
import { DeviceAndChannelService } from './device-and-channel.service';

describe('ProjectOneServerModulesDeviceAndChannelController', () => {
  let controller: DeviceAndChannelController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DeviceAndChannelService],
      controllers: [DeviceAndChannelController],
    }).compile();

    controller = module.get(DeviceAndChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
