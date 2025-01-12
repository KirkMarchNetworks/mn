import { Prisma } from '@prisma/project-one/one';

export const licensedProductSelect = {
  id: true,
  name: true,
  createdAt: true
} satisfies Prisma.LicensedProductSelect;

export type LicensedProductType = Prisma.LicenseGetPayload<{ select: typeof licensedProductSelect }>;
