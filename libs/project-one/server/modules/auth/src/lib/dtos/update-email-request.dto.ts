import { FindFirstTokenInterface } from '@mn/project-one/server/repos/user';

export class UpdateEmailRequestDto implements FindFirstTokenInterface {
  /**
   * The I.D of the user.
   * @example 'clx87e1pk0000gs1lti4tlhd1'
   */
  id!: string;
  /**
   * The generated token to authenticate the confirm email request.
   * @example 'gs1lti4tlhd1'
   */
  token!: string;
}
