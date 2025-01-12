import { Test } from '@nestjs/testing';
import { TenantRepo } from './tenant.repo';

describe('ProjectOneServerTenantRepoService', () => {
  let service: TenantRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TenantRepo],
    }).compile();

    service = module.get(TenantRepo);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
