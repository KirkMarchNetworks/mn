import { ChannelType } from '@mn/project-one/server/repos/device-and-channel';

export class Channel2Entity implements ChannelType {
  /**
   * The I.D of the channel.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The I.D of the tenant.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  deviceId!: string;
  /**
   * The name of the channel.
   * @example 'Channel One'
   */
  name!: string;
  /**
   * The date the entity was created.
   * @example 'Image Upload'
   */
  createdAt!: Date;
  /**
   * The last time the entity was updated.
   * @example 'Image Upload'
   */
  updatedAt!: Date;
}
