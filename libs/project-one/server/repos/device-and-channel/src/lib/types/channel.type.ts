import { Prisma } from '@prisma/project-one/one';

export const channelSelect = {
  id: true,
  deviceId: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ChannelSelect

export type ChannelType = Prisma.ChannelGetPayload<{ select: typeof channelSelect }>;
