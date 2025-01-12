import { Test } from '@nestjs/testing';
import { IntelligentRetrievalController } from './intelligent-retrieval.controller';
import { TenantService } from './tenant.service';

describe('ProjectOneServerTenantController', () => {
  let controller: IntelligentRetrievalController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TenantService],
      controllers: [IntelligentRetrievalController],
    }).compile();

    controller = module.get(IntelligentRetrievalController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
