import { Prisma } from '@prisma/project-one/one';

export const permissionNameSelect = {
  permissionName: true
} satisfies Prisma.PermissionToRoleSelect


export type PermissionNameType = Prisma.PermissionToRoleGetPayload<{ select: typeof permissionNameSelect }>;

