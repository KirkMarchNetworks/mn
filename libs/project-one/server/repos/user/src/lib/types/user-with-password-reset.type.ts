import { Prisma } from '@prisma/project-one/one'
import { userSelect } from '@mn/project-one/server/repos/repo-one';

export const userWithPasswordResetSelect = {
  ...userSelect,
  passwordReset: {
    select: {
      createdAt: true
    }
  }
} satisfies Prisma.UserSelect;

export type UserWithPasswordResetType = Prisma.UserGetPayload<{ select: typeof userWithPasswordResetSelect }>;
