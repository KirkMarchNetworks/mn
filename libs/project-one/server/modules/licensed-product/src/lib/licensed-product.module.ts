import { Module } from '@nestjs/common';
import { LicensedProductRepoModule } from '@mn/project-one/server/repos/licensed-product';
import { LicensedProductController } from './licensed-product.controller';
import { LicensedProductService } from './licensed-product.service';

@Module({
  imports: [LicensedProductRepoModule],
  controllers: [LicensedProductController],
  providers: [LicensedProductService],
  exports: [LicensedProductService],
})
export class LicensedProductModule {}
