import { MinLength } from 'class-validator';
import { BaseSearchRequestDto } from './base-search-request.dto';

export class SearchRequestDto extends BaseSearchRequestDto {
  /**
   * The query to search for
   * @example 'Find me all the empty shelves?'
   */
  @MinLength(1)
  query!: string;
}
