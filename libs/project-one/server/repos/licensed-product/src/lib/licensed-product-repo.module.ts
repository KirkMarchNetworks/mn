import { Module } from '@nestjs/common';
import { RepoOneModule } from '@mn/project-one/server/repos/repo-one';
import { LicensedProductRepo } from './licensed-product.repo';

@Module({
  imports: [RepoOneModule],
  providers: [LicensedProductRepo],
  exports: [LicensedProductRepo],
})
export class LicensedProductRepoModule {}
