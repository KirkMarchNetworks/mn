import { Prisma } from '@prisma/project-one/one';

export const deviceSelect = {
  id: true,
  tenantId: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.DeviceSelect

export type DeviceType = Prisma.DeviceGetPayload<{ select: typeof deviceSelect }>;
