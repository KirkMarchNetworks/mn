import { BaseRouteInterface } from '../../models/base-route.interface';

export interface ImagesRouteInterface extends BaseRouteInterface {
  children: {
    search: BaseRouteInterface;
    upload: BaseRouteInterface;
    events: EventsRouteInterface;
    settings: BaseRouteInterface;
  }
}

interface EventsRouteInterface extends BaseRouteInterface {
  children: {
    create: BaseRouteInterface;
  }
}
