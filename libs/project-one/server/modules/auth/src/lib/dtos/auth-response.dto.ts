import { UserEntity } from '@mn/project-one/server/entities';

export class AuthResponseDto {
  /**
   * The User Entity
   */
  user!: UserEntity;
  /**
   * The token which should be used for future requests (Bearer Authentication)
   */
  token!: string;
}
