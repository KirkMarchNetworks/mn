import { DbSearchDataType } from './db-search-data-type';

export interface FindAllParamsInterface<T> {
  sort: Partial<Record<keyof T, DbSearchDataType>>;
  search: Partial<Record<string, DbSearchDataType>>;
}

