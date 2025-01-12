import { licenseSelect } from '@mn/project-one/server/repos/repo-one';
import { Prisma } from '@prisma/project-one/one';

export const tenantSelect = {
  id: true,
  name: true,
  email: true,
  licenses: {
    select: licenseSelect
  },
} satisfies Prisma.TenantSelect;

export type TenantType = Prisma.TenantGetPayload<{ select: typeof tenantSelect }>;
