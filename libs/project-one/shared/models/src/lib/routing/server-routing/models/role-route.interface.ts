import { BaseRouteInterface } from '../../models/base-route.interface';

export interface RoleRouteInterface extends BaseRouteInterface {
  children: {
    create: BaseRouteInterface,
    delete: BaseRouteInterface,
  }
}
