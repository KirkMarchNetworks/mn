import { IsString } from 'class-validator';

export class ForgotPasswordRequestDto {
  /**
   * The name of the tenant.
   * @example 'tenant1'
   */
  @IsString()
  tenantName!: string;
  /**
   * The email or username of the user who forgot their password.
   * @example 'user1@tenant1.com or user1'
   */
  @IsString()
  emailOrUsername!: string;
}
