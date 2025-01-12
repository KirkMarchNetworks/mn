import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateLicensedProductRequestDto } from './dtos/create-licensed-product-request.dto';
import { allLicensedProductNames } from '@mn/project-one/shared/models';
import { LicensedProductEntity } from './entities/licensed-product.entity';
import { LicensedProductRepo } from '@mn/project-one/server/repos/licensed-product';

@Injectable()
export class LicensedProductService {

  constructor(
    private repo: LicensedProductRepo
  ) {
  }

  async createDefaultLicensedProducts() {
    await this.repo.createDefaultLicensedProducts(allLicensedProductNames.map(name => ({ name })))
  }

  async addLicensedProduct({ name }: CreateLicensedProductRequestDto): Promise<LicensedProductEntity> {
    // Licensed Product creation is currently done via seeding, no need to allow this at the moment.
    throw new NotImplementedException();
    return await this.repo.addLicensedProduct(name);
  }
}
