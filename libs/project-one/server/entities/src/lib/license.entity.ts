import { LicenseType } from '@mn/project-one/server/repos/repo-one';
import { JsonValueType } from '@mn/project-one/server/repos/repo-one';

export class LicenseEntity implements LicenseType {
  /**
   * The I.D of licensed product.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The I.D of the tenant.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  tenantId!: string;
  /**
   * The name of the license
   * @example 'Evidence Vault'
   */
  name!: string;
  /**
   * The date the license was issued
   * @example 'Evidence Vault'
   */
  issuedAt!: Date;
  /**
   * The date the license expires
   * @example 'Evidence Vault'
   */
  expiresAt!: Date | null;
  /**
   * The metadata associated to the license
   * @example 'Evidence Vault'
   */
  metadata!: JsonValueType | null
}
