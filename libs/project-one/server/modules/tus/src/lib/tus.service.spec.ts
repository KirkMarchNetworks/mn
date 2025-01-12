import { Test } from '@nestjs/testing';
import { TusService } from './tus.service';

describe('TusService', () => {
  let service: TusService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TusService],
    }).compile();

    service = module.get(TusService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
