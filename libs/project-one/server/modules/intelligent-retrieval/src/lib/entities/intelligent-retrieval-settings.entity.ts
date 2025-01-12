import { IntelligentRetrievalSettingsType } from '@mn/project-one/server/repos/intelligent-retrieval';
import { GenerativeModelEnum } from '@prisma/project-one/one';
import { ApiProperty } from '@nestjs/swagger';

export class IntelligentRetrievalSettingsEntity implements IntelligentRetrievalSettingsType {
  /**
   * The I.D of the settings.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The name of model.
   */
  @ApiProperty({ enum: GenerativeModelEnum, enumName: 'GenerativeModelEnum' })
  generativeModel!: GenerativeModelEnum;
}
