export class CreateTenantRequestDto {
  /**
   * The name to use for the tenant
   * @example 'Tenant1'
   */
  name!: string;
  /**
   * The email of the tenant.
   * @example 'example@tenant1.com'
   */
  email!: string;
}
