import { LicensedProductNames } from '@mn/project-one/shared/models';
import { LicenseBase } from '../license-base';
import { EvLicenseMetadataInterface } from './ev-license-metadata.interface';

export class EvLicense extends LicenseBase {
  override metadata!: EvLicenseMetadataInterface;

  constructor(
    {
      tenantId,
      expiresAt,
      issuedAt,
      metadata = {
        storageLimitGB: 500,
        downloadLimitGB: 500
      }
    }: {
      tenantId: string,
      expiresAt?: Date,
      issuedAt?: Date,
      metadata?: EvLicenseMetadataInterface,
    }) {

    super({
      tenantId,
      licenseName: LicensedProductNames.EvidenceVault,
      expiresAt,
      issuedAt,
      metadata
    });
  }
}
