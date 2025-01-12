import { Test } from '@nestjs/testing';
import { LicensedProductService } from './licensed-product.service';

describe('LicenseService', () => {
  let service: LicensedProductService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LicensedProductService],
    }).compile();

    service = module.get(LicensedProductService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
