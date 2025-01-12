import { BaseRouteInterface } from '../../models/base-route.interface';

export interface ImagesRouteInterface extends BaseRouteInterface {
  children: {
    search: BaseRouteInterface;
    upload: BaseRouteInterface;
    settings: BaseRouteInterface;
  }
}
