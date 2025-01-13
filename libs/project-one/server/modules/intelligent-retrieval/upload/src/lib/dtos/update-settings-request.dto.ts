import { IsEnum } from 'class-validator';
import { GenerativeModelEnum } from '@prisma/project-one/one';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsRequestDto {
  /**
   * The generative model used for embedding.
   * @example 'AmazonTitanEmbedImageV1'
   */
  @IsEnum(GenerativeModelEnum)
  @ApiProperty({ enum: GenerativeModelEnum, enumName: 'GenerativeModelEnum' })
  generativeModel!: GenerativeModelEnum;
}
