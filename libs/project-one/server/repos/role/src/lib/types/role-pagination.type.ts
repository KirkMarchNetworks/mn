import { Prisma } from '@prisma/project-one/one';

export type RolePaginationType = Required<Pick<Prisma.RoleFindManyArgs, 'take' | 'skip' | 'where' | 'orderBy'>>
