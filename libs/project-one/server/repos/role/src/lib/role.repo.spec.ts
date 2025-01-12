import { Test } from '@nestjs/testing';
import { RoleRepo } from './role.repo';

describe('ProjectOneServerRoleRepoService', () => {
  let service: RoleRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RoleRepo],
    }).compile();

    service = module.get(RoleRepo);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
