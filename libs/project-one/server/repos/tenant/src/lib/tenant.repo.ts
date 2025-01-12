import { Injectable } from '@nestjs/common';
import { RepoOneService, userSelect } from '@mn/project-one/server/repos/repo-one';
import { Prisma } from '@prisma/project-one/one';
import { tenantSelect } from './types/tenant.type';

type TenantPaginationType = Required<Pick<Prisma.TenantFindManyArgs, 'take' | 'skip' | 'where' | 'orderBy'>>;

@Injectable()
export class TenantRepo {
  constructor(
    private repoOneService: RepoOneService
  ) {
  }

  async getCount(params: TenantPaginationType) {
    return await this.repoOneService.tenant.count({
      where: params.where
    });
  }

  async getTenants(params: TenantPaginationType) {
    return await this.repoOneService.tenant.findMany({
      ...params,
      select: tenantSelect
    });
  }

  async createTenant(name: string, email: string) {
    return await this.repoOneService.tenant.create({
      data: {
        name,
        email
      },
      select: {
        id: true
      }
    });
  }

  async deleteTenant(name: string) {
    const deletedAt = new Date();
    return await this.repoOneService.tenant.update({
      where: {
        name
      },
      data: {
        deletedAt,
        users: {
          updateMany: {
            where: {},
            data: {
              deletedAt
            }
          }
        },
        roles: {
          updateMany: {
            where: {},
            data: {
              deletedAt
            }
          }
        }
      }
    });
  }
}
