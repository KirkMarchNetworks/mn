import { BaseRouteInterface } from '../../models/base-route.interface';

export interface UserRouteInterface extends BaseRouteInterface {
  children: {
    delete: BaseRouteInterface,
  }
}
