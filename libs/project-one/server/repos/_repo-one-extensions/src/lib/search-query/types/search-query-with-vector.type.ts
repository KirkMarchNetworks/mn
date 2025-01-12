import { SearchQueryType } from './search-query.type';

export type SearchQueryWithVectorType = SearchQueryType & {
  vector: number[];
}
