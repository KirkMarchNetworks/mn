import { Prisma } from '@prisma/project-one/one'
import { userSelect } from '@mn/project-one/server/repos/repo-one';

export const userWithPasswordSelect = {
  ...userSelect,
  password: true
} satisfies Prisma.UserSelect;

export type UserWithPasswordType = Prisma.UserGetPayload<{ select: typeof userWithPasswordSelect }>;
