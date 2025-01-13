import { MinLength, Min, Max } from "class-validator";

export class CreateIntelligentRetrievalEventRequestDto {
  /**
   * The name for the event
   * @example 'Event 1'
   */
  @MinLength(1)
  name!: string;

  /**
   * The query for the event
   * @example 'Find me all the empty shelves?'
   */
  @MinLength(1)
  searchQueryId!: string;

  /**
   * The desired threshold similarity score (1 - 100)
   * @example '30'
   */
  @Min(1)
  @Max(100)
  similarityScore!: number;
}
