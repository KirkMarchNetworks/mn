import { Channel2Entity } from "../entities/channel2.entity";
import { Device2Entity } from "../entities/device2.entity";

export class GetAllDevicesAndChannelsResponseDto {
  /**
   * All the devices.
   */
  devices!: Device2Entity[];
  /**
   * All the channels.
   */
  channels!: Channel2Entity[];
}
