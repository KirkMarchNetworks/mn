import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  total!: number;

  take!: number;

  skip!: number;

  // This is needed here for some reason to fix the bug
  // Error: A circular dependency has been detected (property key: "results").
  // Please, make sure that each side of a bidirectional relationships are using lazy resolvers ("type: () => ClassType").
  @ApiProperty({  required: true })
  results!: T[];
}
