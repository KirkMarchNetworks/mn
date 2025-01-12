import { UserType } from '@mn/project-one/server/repos/repo-one';
import { RoleEntity } from './role.entity';
import { Expose } from 'class-transformer';

export class UserEntity implements UserType {
  /**
   * The user's I.D
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  @Expose() id!: string;
  /**
   * The user's public I.D
   * @example 'ONohhLghll'
   */
  @Expose() publicId!: string;
  /**
   * The user's email address
   * @example 'example@example.com'
   */
  @Expose() email!: string;
  /**
   * The user's email address
   * @example 'user1'
   */
  @Expose() username!: string;
  /**
   * The I.D of the tenant
   * @example 'clx87e1pk0000gs1lti4tlhd1'
   */
  @Expose() tenantId!: string;
  /**
   * Is the user currently enabled
   * @example 'true'
   */
  @Expose() enabled!: boolean;
  /**
   * Has the user verified their email address
   * @example 'false'
   */
  @Expose() verifiedEmail!: boolean;
  /**
   * The Role attached to this User
   */
  @Expose() role!: RoleEntity;
}
