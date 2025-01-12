import { BaseRouteInterface } from '../../models/base-route.interface';

export interface TenantRouteInterface extends BaseRouteInterface {
  children: {
    create: BaseRouteInterface,
    createWithDefaults: BaseRouteInterface,
    delete: BaseRouteInterface
  }
}
