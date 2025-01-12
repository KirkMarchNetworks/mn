import { Prisma } from '@prisma/project-one/one'
import { permissionNameSelect } from './permission-name.type';

export const roleSelect = {
  id: true,
  name: true,
  permissions: {
    select: permissionNameSelect
  },
} satisfies Prisma.RoleSelect;

export type RoleType = Prisma.RoleGetPayload<{ select: typeof roleSelect }>;
