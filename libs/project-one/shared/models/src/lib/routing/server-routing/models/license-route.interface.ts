import { BaseRouteInterface } from '../../models/base-route.interface';

export interface LicenseRouteInterface extends BaseRouteInterface {
  children: {
    addEvLicense: BaseRouteInterface,
  }
}
