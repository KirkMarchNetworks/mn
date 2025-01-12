import { Injectable } from '@nestjs/common';
import { EvLicense, LicenseRepo } from '@mn/project-one/server/repos/license';
import { CreateEvLicenseRequestDto } from './dtos/create-ev-license-request.dto';
import { LicenseEntity } from '@mn/project-one/server/entities';

@Injectable()
export class LicenseService {
  constructor(
    private repo: LicenseRepo
  ) {}

  async getLicenses(tenantId: string) {
    return await this.repo.getLicenses(tenantId);
  }

  async addEvLicense(dto: CreateEvLicenseRequestDto): Promise<LicenseEntity> {
    const data = new EvLicense(dto);
    return await this.repo.addLicense(data);
  }
}
