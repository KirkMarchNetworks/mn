import { IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';

export class BaseSearchRequestDto {
  /**
   * The device I.D
   * @example '2'
   */
  @IsOptional()
  @IsString()
  deviceId?: string;

  /**
   * The channel I.D
   * @example '2'
   */
  @IsOptional()
  @IsString()
  channelId?: string;

  /**
   * The maximum amount of desired results to return
   * @example '2'
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  resultsToReturn?: number;
}
