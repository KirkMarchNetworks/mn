import { Test } from '@nestjs/testing';
import { SharedRepo } from './shared.repo';

describe('SharedRepoService', () => {
  let service: SharedRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SharedRepo],
    }).compile();

    service = module.get(SharedRepo);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
