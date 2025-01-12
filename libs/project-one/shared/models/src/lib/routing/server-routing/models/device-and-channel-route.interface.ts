import { BaseRouteInterface } from '../../models/base-route.interface';

export interface DeviceAndChannelRouteInterface extends BaseRouteInterface {
  children: {
    createDevice: BaseRouteInterface,
    createChannel: BaseRouteInterface,
  }
}
