import { EvLicenseMetadataInterface } from '@mn/project-one/server/repos/license';
import { JsonValueType } from '@mn/project-one/server/repos/repo-one';

export class EvLicenseMetadataDto implements EvLicenseMetadataInterface {
  /**
   * The amount a tenant can download in GB
   * @example '500'
   */
  downloadLimitGB!: number;
  /**
   * The amount a tenant can store in GB
   * @example '1000'
   */
  storageLimitGB!: number;

  // This is needed to satisfy the JsonObject constraint
  [x: string]: JsonValueType | undefined;
}
