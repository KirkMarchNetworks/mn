import { Test } from '@nestjs/testing';
import { DeviceAndChannelRepo } from './device-and-channel.repo';

describe('ProjectOneServerReposDeviceAndChannelService', () => {
  let service: DeviceAndChannelRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DeviceAndChannelRepo],
    }).compile();

    service = module.get(DeviceAndChannelRepo);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
