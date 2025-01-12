import { Prisma } from '@prisma/project-one/one';

export const intelligentRetrievalSettingsSelect = {
  id: true,
  generativeModel: true
} satisfies Prisma.IntelligentRetrievalSettingsSelect

export type IntelligentRetrievalSettingsType = Prisma.IntelligentRetrievalSettingsGetPayload<{ select: typeof intelligentRetrievalSettingsSelect }>;
