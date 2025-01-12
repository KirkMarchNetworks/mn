import { RoleType } from '@mn/project-one/server/repos/repo-one';
import { PermissionEntity } from './permission.entity';

export class RoleEntity implements RoleType {
  /**
   * The I.D of the role
   * @example 'clx87e1pk0000gs1lti4tlhd1'
   */
  id!: string;
  /**
   * The name of the role
   * @example 'Role 1'
   */
  name!: string;
  /**
   * The permissions associated to the role
   */
  permissions!: PermissionEntity[];
}
