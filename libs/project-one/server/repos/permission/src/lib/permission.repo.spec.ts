import { Test } from '@nestjs/testing';
import { PermissionRepo } from './permission.repo';

describe('ProjectOneServerPermissionRepoService', () => {
  let service: PermissionRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PermissionRepo],
    }).compile();

    service = module.get(PermissionRepo);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
