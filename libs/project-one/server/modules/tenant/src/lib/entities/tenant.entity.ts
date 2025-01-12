import { TenantType } from '@mn/project-one/server/repos/tenant';
import { LicenseEntity } from '@mn/project-one/server/entities';

export class TenantEntity implements TenantType {
  /**
   * The I.D of the tenant
   * @example 'clx87e1pk0000gs1lti4tlhd1'
   */
  id!: string;
  /**
   * The name of the tenant
   * @example 'Tenant 1'
   */
  name!: string;
  /**
   * The admin email of the tenant
   * @example 'admin@tenant1.com'
   */
  email!: string;
  /**
   * The permissions associated to the role
   */
  licenses!: LicenseEntity[];
}
