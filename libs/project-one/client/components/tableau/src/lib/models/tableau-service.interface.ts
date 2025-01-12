import { Observable } from 'rxjs';
import { Store } from '@ngneat/elf';
import { FindAllParamsInterface } from './find-all-params.interface';

export interface TableauServiceInterface<T> {
  store:  Store;
  findAll(params: FindAllParamsInterface): Observable<{total: number; take: number; skip: number; results: Array<T>}>
  idKey?: keyof T & string;
  //pageSizeOptions?: number[]; // = [10, 20, 50, 100];
  //pageSize?: number; // = 100;
}
