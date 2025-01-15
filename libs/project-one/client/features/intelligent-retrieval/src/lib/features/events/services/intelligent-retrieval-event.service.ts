import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { addEntities, withEntities } from '@ngneat/elf-entities';
import {
  FindAllParamsInterface,
  TableauBaseService,
} from '@mn/project-one/client/components/tableau';
import {
  CreateIntelligentRetrievalEventRequestDto,
  IntelligentRetrievalEventEntity,
  IntelligentRetrievalEventsApiService
} from '@mn/project-one/shared/api-client';
import { withPagination } from '@ngneat/elf-pagination';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntelligentRetrievalEventService extends TableauBaseService<IntelligentRetrievalEventEntity> {

  private store;

  constructor(private service: IntelligentRetrievalEventsApiService) {
    const store = createStore(
      { name: 'intelligentRetrievalEvents' },
      withEntities<IntelligentRetrievalEventEntity>(),
      withPagination({ initialPage: 0 })
    );

    const findAll = (params: FindAllParamsInterface) => {
      const { take, skip, sort, search } = params;

      return service.eventControllerFindAll(take, skip, sort, search);
    };

    super({
      store,
      findAll,
    });

    this.store = store;
  }

  createEvent(dto: CreateIntelligentRetrievalEventRequestDto) {
    return this.service.eventControllerCreate(dto).pipe(
      tap(res => this.store.update(addEntities(res)))
    )
  }
}
