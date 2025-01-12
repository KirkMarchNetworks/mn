import { CreateUserType } from '@mn/project-one/server/repos/user';

export class CreateUserRequestDto implements CreateUserType {
  /**
   * The username for the user.
   * @example 'user1'
   */
  username!: string;
  /**
   * The email of the user.
   * @example 'user1@tenant1.com'
   */
  email!: string;
  /**
   * The I.D of the role which should be assigned to the user
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  roleId!: string;
}
