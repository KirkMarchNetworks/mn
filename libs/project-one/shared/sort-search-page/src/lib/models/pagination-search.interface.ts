export type SearchValueType =  string | number | boolean;

export interface PaginationSearchInterface<T> {
  field: keyof T;
  term: string;
  value: SearchValueType;
}
