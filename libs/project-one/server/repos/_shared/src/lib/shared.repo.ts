import { Injectable, NotFoundException } from '@nestjs/common';
import { RepoOneService } from '@mn/project-one/server/repos/repo-one';

@Injectable()
export class SharedRepo {
  constructor(
    private repoOneService: RepoOneService
  ) {
  }

  async confirmRoleIdBelongsToTenantOrThrow(tenantId: string, roleId: string) {
    const role = await this.repoOneService.role.findFirst({
      where: {
        tenantId,
        id: roleId
      },
      select: {
        id: true
      }
    });

    if (! role) {
      throw new NotFoundException();
    }

    return role;
  }
}
