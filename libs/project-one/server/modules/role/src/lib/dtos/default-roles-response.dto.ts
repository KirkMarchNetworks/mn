import { DefaultRolesInterface } from '@mn/project-one/server/repos/role';

export class DefaultRolesResponseDto implements DefaultRolesInterface {
  /**
   * The admin role I.D
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  adminRoleId!: string;
  /**
   * The limited role I.D
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  limitedRoleId!: string;
  /**
   * The some role I.D
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  someRoleId!: string;
}
