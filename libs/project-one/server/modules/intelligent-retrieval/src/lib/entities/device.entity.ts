import { DeviceType } from '@mn/project-one/server/repos/intelligent-retrieval';

export class DeviceEntity implements DeviceType {
  /**
   * The I.D of the device.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The name of the device.
   * @example 'Device 1'
   */
  name!: string;
}
