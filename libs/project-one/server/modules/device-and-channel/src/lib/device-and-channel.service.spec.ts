import { Test } from '@nestjs/testing';
import { DeviceAndChannelService } from './device-and-channel.service';

describe('ProjectOneServerModulesDeviceAndChannelService', () => {
  let service: DeviceAndChannelService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DeviceAndChannelService],
    }).compile();

    service = module.get(DeviceAndChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
