import { DeviceType } from '@mn/project-one/server/repos/device-and-channel';

export class Device2Entity implements DeviceType {
  /**
   * The I.D of the device.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The I.D of the tenant.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  tenantId!: string;
  /**
   * The name of the device.
   * @example 'Device One'
   */
  name!: string;
  /**
   * The date the device was created.
   * @example 'Image Upload'
   */
  createdAt!: Date;
  /**
   * The last time the device was updated.
   * @example 'Image Upload'
   */
  updatedAt!: Date;
}
