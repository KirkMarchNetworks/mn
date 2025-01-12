import { BaseRouteInterface } from '../../models/base-route.interface';

export interface LicensedProductRouteInterface extends BaseRouteInterface {
  children: {
    create: BaseRouteInterface,
  }
}
