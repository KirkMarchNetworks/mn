import { Prisma } from '@prisma/project-one/one';
import { channelSelect } from './channel.type';

export const channelImageSelect = {
  id: true,
  fileName: true,
  originalName: true,
  timestamp: true,
  channel: {
    select: channelSelect
  },
} satisfies Prisma.ChannelImageSelect

export type ChannelImageType = Prisma.ChannelImageGetPayload<{ select: typeof channelImageSelect }>;
