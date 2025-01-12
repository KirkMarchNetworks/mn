import { Injectable } from '@nestjs/common';
import { licenseSelect, RepoOneService } from '@mn/project-one/server/repos/repo-one';
import { CreateLicenseType } from './types/create-license.type';

@Injectable()
export class LicenseRepo {
  constructor(
    private repoOneService: RepoOneService
  ) {
  }

  async getLicenses(tenantId: string) {
    return await this.repoOneService.license.findMany({
      where: {
        tenantId
      },
      select: licenseSelect
    });
  }

  async addLicense(data: CreateLicenseType) {
    return await this.repoOneService.license.create(
      {
        data,
        select: licenseSelect
      });
  }
}
