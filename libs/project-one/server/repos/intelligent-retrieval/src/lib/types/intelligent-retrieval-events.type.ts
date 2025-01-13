import { Prisma } from '@prisma/project-one/one';
import { searchQuerySelect } from '@mn/project-one/server/repos/repo-one-extensions';

export const intelligentRetrievalEventsSelect = {
  id: true,
  name: true,
  similarityScore: true,
  createdAt: true,
  updatedAt: true,
  searchQuery: {
    select: searchQuerySelect
  }
} satisfies Prisma.IntelligentRetrievalEventsSelect

export type IntelligentRetrievalEventsType = Prisma.IntelligentRetrievalEventsGetPayload<{ select: typeof intelligentRetrievalEventsSelect }>;
