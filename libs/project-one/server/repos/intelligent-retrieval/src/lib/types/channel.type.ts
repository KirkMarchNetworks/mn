import { Prisma } from '@prisma/project-one/one';
import { deviceSelect } from './device.type';

export const channelSelect = {
  id: true,
  name: true,
  device: {
    select: deviceSelect
  }
} satisfies Prisma.ChannelSelect

export type ChannelType = Prisma.ChannelGetPayload<{ select: typeof channelSelect }>;
