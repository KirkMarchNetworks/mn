export class CreateRoleRequestDto {
  /**
   * The name to use for the role.
   * @example 'Role 1'
   */
  name!: string;
  /**
   * A brief description of the role.
   * @example 'A limited amount of permissions'
   */
  description!: string;
  /**
   * All the permission names to associate with the role.
   * @example [ 'create_roles', 'delete_roles' ]
   */
  permissionNames?: string[];
}
