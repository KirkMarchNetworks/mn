import { BaseRouteInterface } from '../../models/base-route.interface';

export interface SettingsRouteInterface extends BaseRouteInterface {
  children: {
    menu: BaseRouteInterface;
  }
}
