import { ChannelImageType } from '@mn/project-one/server/repos/intelligent-retrieval';
import { ChannelEntity } from './channel.entity';

export class ChannelImageEntity implements ChannelImageType {
  /**
   * The I.D of the role.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The associated channel.
   */
  channel!: ChannelEntity;
  /**
   * The name of the file.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  fileName!: string;
  /**
   * The name of the file.
   * @example 'red-shirt'
   */
  originalName!: string;
  /**
   * The timestamp of the image.
   * @example '2024-09-19T14:54:11.287Z'
   */
  timestamp!: Date;
}
