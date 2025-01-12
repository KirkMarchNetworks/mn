import { Test } from '@nestjs/testing';
import { RepoOneService } from './repo-one.service';

describe('RepoOneService', () => {
  let service: RepoOneService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RepoOneService],
    }).compile();

    service = module.get(RepoOneService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
