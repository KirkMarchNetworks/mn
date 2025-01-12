/**
 * Query Param values used for sorting, filtering, paging in tableau
 * Null values will remove a previous query param
 */
export interface TableauQueryParamsInterface {
  take: number | null;
  skip: number | null;
  sort: string | null;
  search: string | null;
  additional?: { [key: string] : string };
}
