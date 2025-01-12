import { Injectable } from '@nestjs/common';
import { RepoOneService } from '@mn/project-one/server/repos/repo-one';
import { CreateLicensedProductType } from './types/create-licensed-product.type';

@Injectable()
export class LicensedProductRepo {
  constructor(
    private repoOneService: RepoOneService
  ) {
  }

  async createDefaultLicensedProducts(data: CreateLicensedProductType) {
    await this.repoOneService.licensedProduct.createMany({ data });
  }

  async addLicensedProduct(name: string) {
    return await this.repoOneService.licensedProduct.create({
      data: {
        name
      }
    });
  }
}
