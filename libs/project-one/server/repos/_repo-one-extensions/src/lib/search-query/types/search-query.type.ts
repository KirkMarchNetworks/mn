import { Prisma } from '@prisma/project-one/one';

export const searchQuerySelect = {
  id: true,
  lowerCaseQuery: true,
  originalQuery: true,
  fileName: true,
} satisfies Prisma.SearchQuerySelect

export type SearchQueryType = Prisma.SearchQueryGetPayload<{ select: typeof searchQuerySelect }>;
