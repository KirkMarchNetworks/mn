import { ChannelType } from '@mn/project-one/server/repos/intelligent-retrieval';
import { DeviceEntity } from './device.entity';

export class ChannelEntity implements ChannelType {
  /**
   * The I.D of the channel.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The name of the channel.
   * @example 'Channel 1'
   */
  name!: string;
  /**
   * The associated device.
   */
  device!: DeviceEntity;
}
