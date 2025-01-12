import { TableauServiceInterface } from '../models/tableau-service.interface';
import { BehaviorSubject, of, tap } from 'rxjs';
import { upsertEntities } from '@ngneat/elf-entities';
import { catchError } from 'rxjs/operators';
import { setPage, skipWhilePageExists, updatePaginationData } from '@ngneat/elf-pagination';
import { FindAllParamsInterface } from '../models/find-all-params.interface';

export class TableauBaseService<T> {
  derivedService: TableauServiceInterface<T>;

  private _idKey = 'id';

  private _isLoadingResultsSubject = new BehaviorSubject(false);
  isLoadingResults$ = this._isLoadingResultsSubject.asObservable();

  private _resultsLengthSubject = new BehaviorSubject(0);
  resultsLength$ = this._resultsLengthSubject.asObservable();

  private _triggerRefreshSubject = new BehaviorSubject(null);
  triggerRefresh$ = this._triggerRefreshSubject.asObservable();

  constructor({ store, findAll, idKey, }: TableauServiceInterface<T>) {
    this.derivedService = {
      store, findAll
    };
    if (idKey) {
      this._idKey = idKey;
    }
  }

  triggerRefresh() {
    this._triggerRefreshSubject.next(null);
  }

  findAll(params: FindAllParamsInterface) {
    this._isLoadingResultsSubject.next(true);

    let currentPage = 0;
    const { take, skip } = params;
    if (typeof take === 'number' && typeof skip === 'number') {
      currentPage = skip / take;
    }

    return this.derivedService.findAll(params).pipe(
      skipWhilePageExists(this.derivedService.store, currentPage),
      tap(res => {
        // If for some reason the total results is less than skip, we should reset skip back to 0
        // This could happen in a situation where user deletes many items and uses the back button which had a previous high skip value in url
        if (typeof skip === 'number' && res.total < skip) {
          console.log('Resetting skip back to 0');
          //this._updateQueryParams({
          //  skip: 0
          //});
        }
        this.derivedService.store.update(
          upsertEntities(res.results),
          updatePaginationData({
            currentPage,
            perPage: take!,
            total: res.total,
            lastPage: 1 // this.paginator!.getNumberOfPages()
          }),
          setPage(currentPage, res.results.map((x: any) => x[this._idKey])),
        )
        this._resultsLengthSubject.next(res.total);
        this._isLoadingResultsSubject.next(false);
      }),
      catchError(() => of(null))
    );
  }
}
