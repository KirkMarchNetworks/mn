import { Test } from '@nestjs/testing';
import { LicensedProductRepo } from './licensed-product.repo';

describe('ProjectOneServerLicenseRepoService', () => {
  let service: LicensedProductRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LicensedProductRepo],
    }).compile();

    service = module.get(LicensedProductRepo);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
