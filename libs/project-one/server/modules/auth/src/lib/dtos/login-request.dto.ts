import { ForgotPasswordRequestDto } from './forgot-password-request.dto';
import { MinLength } from 'class-validator';

export class LoginRequestDto extends ForgotPasswordRequestDto {
  /**
   * The password for the user.
   * @example '1'
   */
  @MinLength(1)
  password!: string;
}
