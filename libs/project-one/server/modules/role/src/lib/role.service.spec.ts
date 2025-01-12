import { Test } from '@nestjs/testing';
import { RoleService } from './role.service';

describe('ProjectOneServerRoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RoleService],
    }).compile();

    service = module.get(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
