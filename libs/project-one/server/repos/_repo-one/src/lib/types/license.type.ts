import { Prisma } from '@prisma/project-one/one';

export const licenseSelect = {
  id: true,
  tenantId: true,
  name: true,
  issuedAt: true,
  expiresAt: true,
  metadata: true
} satisfies Prisma.LicenseSelect

export type LicenseType = Prisma.LicenseGetPayload<{ select: typeof licenseSelect }>;
