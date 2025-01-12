import { Injectable } from '@nestjs/common';
import { allPermissionNames } from '@mn/project-one/shared/models';
import { PermissionRepo } from '@mn/project-one/server/repos/permission';

@Injectable()
export class PermissionService {

  constructor(private repo: PermissionRepo) {
  }

  async createDefaultPermissions() {
    await this.repo.createDefaultPermissions(allPermissionNames.map(name => ({ name })))
  }
}
