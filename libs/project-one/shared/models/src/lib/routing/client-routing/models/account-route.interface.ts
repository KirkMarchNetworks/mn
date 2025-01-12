import { BaseRouteInterface } from '../../models/base-route.interface';

export interface AccountRouteInterface extends BaseRouteInterface {
  children: {
    login: BaseRouteInterface
  }
}
