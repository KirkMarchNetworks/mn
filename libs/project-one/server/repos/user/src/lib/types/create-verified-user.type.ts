import { Prisma } from '@prisma/project-one/one';
import { CreateUserType } from './create-user.type';

export type CreateVerifiedUserType =
  CreateUserType &
  Required<Pick<Prisma.UserUncheckedCreateInput, 'password'>>;
