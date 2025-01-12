import { RoleWithPermissionsType } from '@mn/project-one/server/repos/role';
import { PermissionEntity } from '@mn/project-one/server/entities';

export class RoleWithPermissionsEntity implements RoleWithPermissionsType {
  /**
   * The I.D of the tenant.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  tenantId!: string;
  /**
   * The I.D of the role.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The name of the role.
   * @example 'Role 1'
   */
  name!: string;
  /**
   * The description of the role.
   * @example 'A description of the role'
   */
  description!: string;
  /**
   * The permissions associated to the role.
   */
  permissions!: PermissionEntity[];
}
