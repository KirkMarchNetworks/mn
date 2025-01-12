import { Prisma } from '@prisma/project-one/one';

export type CreateUserType = Pick<Prisma.UserUncheckedCreateInput,
  'username' |
  'email' |
  'roleId'
>;
