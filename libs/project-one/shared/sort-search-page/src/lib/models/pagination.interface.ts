import { SortSearchInterface } from "./sort-search.interface";

export type SortByType = 'asc' | 'desc';
export type SearchValueType =  string | number | boolean;

export interface PaginationInterface {
  skip: number;
  take: number;
  sort: { field: string, by: SortByType }[];
  search: { field: string, term: string, value: SearchValueType }[];
  sortSearch: SortSearchInterface<any>
}
