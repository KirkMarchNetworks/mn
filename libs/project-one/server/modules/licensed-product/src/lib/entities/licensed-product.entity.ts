import { LicensedProductType } from '@mn/project-one/server/repos/licensed-product';

export class LicensedProductEntity implements LicensedProductType {
  /**
   * The I.D of the license.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The name of the license.
   * @example 'Evidence Vault'
   */
  name!: string;
  /**
   * The date the license was created.
   * @example '2024-08-21'
   */
  createdAt!: Date;
}
