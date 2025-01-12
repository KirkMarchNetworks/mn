import { Prisma } from '@prisma/project-one/one'
import { AdminRoleName, LimitedRoleName, SomeRoleName } from './role-names';

export const allDefaultRoles = (tenantId: string): Prisma.RoleCreateManyInput[] => [
  {
    tenantId,
    name: AdminRoleName,
    description: 'All permissions.',
    type: 'AdminRole'
  },
  {
    tenantId,
    name: SomeRoleName,
    description: 'Some permissions.',
    type: 'SomeRole'
  },
  {
    tenantId,
    name: LimitedRoleName,
    description: 'Limited permissions.',
    type: 'LimitedRole'
  }
];
