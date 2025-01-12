import { UpdateEmailRequestDto } from './update-email-request.dto';

export class ConfirmEmailRequestDto extends UpdateEmailRequestDto {
  /**
   * The desired password.
   * @example '.$gs%1lti4hd1!'
   */
  password!: string;
}
