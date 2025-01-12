import { Test } from '@nestjs/testing';
import { PermissionService } from './permission.service';

describe('ProjectOneServerPermissionService', () => {
  let service: PermissionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PermissionService],
    }).compile();

    service = module.get(PermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
