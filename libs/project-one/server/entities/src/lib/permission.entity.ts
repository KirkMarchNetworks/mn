import { PermissionNameType } from '@mn/project-one/server/repos/repo-one';

export class PermissionEntity implements PermissionNameType {
  /**
   * The name of the permission
   * @example 'create_roles'
   */
  permissionName!: string;
}
