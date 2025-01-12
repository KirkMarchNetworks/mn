import { Injectable } from '@nestjs/common';
import { UserRepo } from '@mn/project-one/server/repos/user';
import { UserEntity } from '@mn/project-one/server/entities';
import { PaginationInterface, SearchValueType, SortByType } from '@mn/project-one/shared/sort-search-page';
import { PaginatedDto } from '@mn/project-one/server/dtos';
import { Prisma } from '@prisma/project-one/one';
import { paginationExtractor } from '@mn/project-one/server/models';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepo,
  ) {}

  async findAllPaginated(tenantId: string, pagination: PaginationInterface): Promise<PaginatedDto<UserEntity>> {

    const params = paginationExtractor(pagination);

    const totalCount = await this.userRepo.getUserCountForTenant(tenantId, params);

    console.log('totalCount', totalCount);

    const results = await this.userRepo.getUsers(tenantId, params);

    const p = new PaginatedDto<UserEntity>();
    p.take = params.take;
    p.skip = params.skip;
    p.total = totalCount;
    p.results = results;
    return p;
  }

}
