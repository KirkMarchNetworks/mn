import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import { FindAllParamsInterface, TableauBaseService } from '@mn/project-one/client/components/tableau';
import { RoleApiService, RoleEntity } from '@mn/project-one/shared/api-client';
import { withPagination } from '@ngneat/elf-pagination';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends TableauBaseService<RoleEntity> {
  private store;

  constructor(private service: RoleApiService) {
    const store = createStore(
      { name: 'publicUsers'},
      withEntities<RoleEntity>(),
      withPagination({ initialPage: 0 })
    );

    const findAll = (params: FindAllParamsInterface) => {
      const { take, skip, sort, search } = params;
      return service.roleControllerFindAll(take, skip, sort, search)
    }
    super({
      store,
      findAll,
    })

    this.store = store;
  }
}
