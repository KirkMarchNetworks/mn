import { Prisma } from '@prisma/project-one/one';

export type CreateLicenseType = Pick<Prisma.LicenseUncheckedCreateInput,
  'tenantId' |
  'name' |
  'issuedAt' |
  'expiresAt' |
  'metadata'
>;
