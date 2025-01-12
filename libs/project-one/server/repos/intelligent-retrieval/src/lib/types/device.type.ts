import { Prisma } from '@prisma/project-one/one';

export const deviceSelect = {
  id: true,
  name: true,
} satisfies Prisma.DeviceSelect

export type DeviceType = Prisma.DeviceGetPayload<{ select: typeof deviceSelect }>;
