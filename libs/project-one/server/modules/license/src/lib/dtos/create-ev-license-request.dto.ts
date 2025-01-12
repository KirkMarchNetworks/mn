import { EvLicenseInterface } from '@mn/project-one/server/repos/license';
import { EvLicenseMetadataDto } from './ev-license-metadata.dto';

export class CreateEvLicenseRequestDto implements EvLicenseInterface {
  /**
   * The I.D of the tenant.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  tenantId!: string;
  /**
   * The date at which the license expires
   * @example '2026-07-01'
   */
  expiresAt?: Date;
  /**
   * The date at which the license was issued at
   * @example '2025-07-01'
   */
  issuedAt?: Date;
  /**
   * The required metadata for the license
   */
  metadata?: EvLicenseMetadataDto;
}
