import { Test } from '@nestjs/testing';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('ProjectOneServerTenantController', () => {
  let controller: TenantController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TenantService],
      controllers: [TenantController],
    }).compile();

    controller = module.get(TenantController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
