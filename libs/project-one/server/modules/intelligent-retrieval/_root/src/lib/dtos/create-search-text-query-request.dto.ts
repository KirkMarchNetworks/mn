import { MinLength } from 'class-validator';

export class CreateSearchTextQueryRequestDto {
  /**
   * The query to create
   * @example 'Find me all the empty shelves?'
   */
  @MinLength(1)
  query!: string;
}
