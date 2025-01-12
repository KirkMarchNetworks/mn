import { Injectable } from '@nestjs/common';
import { RepoOneService } from '@mn/project-one/server/repos/repo-one';
import { CreatePermissionType } from './types/create-permission.type';

@Injectable()
export class PermissionRepo {
  constructor(
    private repoOneService: RepoOneService
  ) {
  }

  async createDefaultPermissions(data: CreatePermissionType) {
    await this.repoOneService.permission.createMany({ data });
  }
}
