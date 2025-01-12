import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import { FindAllParamsInterface, TableauBaseService } from '@mn/project-one/client/components/tableau';
import { TenantApiService, TenantEntity } from '@mn/project-one/shared/api-client';
import { withPagination } from '@ngneat/elf-pagination';

@Injectable({
  providedIn: 'root'
})
export class TenantManagementService extends TableauBaseService<TenantEntity> {
  private store;

  constructor(private service: TenantApiService) {
    const store = createStore(
      { name: 'tenants'},
      withEntities<TenantEntity>(),
      withPagination({ initialPage: 0 })
    );

    const findAll = (params: FindAllParamsInterface) => {
      const { take, skip, sort, search } = params;
      return service.tenantControllerGetAll(take, skip, sort, search)
    }
    super({
      store,
      findAll,
    })

    this.store = store;
  }
}
