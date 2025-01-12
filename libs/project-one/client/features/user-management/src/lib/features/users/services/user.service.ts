import { inject, Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import { FindAllParamsInterface, TableauBaseService } from '@mn/project-one/client/components/tableau';
import { UserApiService, UserEntity } from '@mn/project-one/shared/api-client';
import { CoreRepo } from '@mn/project-one/client/repos/core';
import { withPagination } from '@ngneat/elf-pagination';

@Injectable({
  providedIn: 'root'
})
export class UserService extends TableauBaseService<UserEntity> {
  private coreRepo = inject(CoreRepo);
  private store;

  constructor(private service: UserApiService) {
    const store = createStore(
      { name: 'publicUsers'},
      withEntities<UserEntity, 'publicId'>({ idKey: 'publicId' }),
      withPagination({ initialPage: 0 })
    );

    const findAll = (params: FindAllParamsInterface) => {
      const { take, skip, sort, search } = params;
      return service.userControllerFindAll(take, skip, sort, search)
    }
    super({
      store,
      findAll,
      idKey: 'publicId'
    })

    this.store = store;
  }
}
