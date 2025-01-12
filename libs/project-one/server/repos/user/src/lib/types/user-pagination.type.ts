import { Prisma } from '@prisma/project-one/one';

export type UserPaginationType = Required<Pick<Prisma.UserFindManyArgs, 'take' | 'skip' | 'where' | 'orderBy'>>
