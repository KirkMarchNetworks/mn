import { BaseRouteInterface } from '../../models/base-route.interface';

export interface FileRouteInterface extends BaseRouteInterface {
  children: {
    tus: BaseRouteInterface,
  }
}
