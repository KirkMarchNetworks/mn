import { permissionNameSelect } from '@mn/project-one/server/repos/repo-one';
import { Prisma } from '@prisma/project-one/one';

export const roleWithPermissionsSelect = {
  tenantId: true,
  id: true,
  name: true,
  description: true,
  permissions: {
    select: permissionNameSelect
  },
} satisfies Prisma.RoleSelect;

export type RoleWithPermissionsType = Prisma.RoleGetPayload<{ select: typeof roleWithPermissionsSelect }>;
