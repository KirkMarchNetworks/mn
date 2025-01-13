import { BaseRouteInterface } from '../../models/base-route.interface';

export interface IntelligentRetrievalRouteInterface extends BaseRouteInterface {
  children: {
    getImage: BaseRouteInterface,
    imageCount: BaseRouteInterface,
    upload: BaseRouteInterface,
    events: EventRouteInterface,
    searchQuery: SearchQueryRouteInterface,
    settings: SettingsRouteInterface,
  }
}

interface EventRouteInterface extends BaseRouteInterface {
  children: {
    create: BaseRouteInterface,
  }
}

interface SearchQueryRouteInterface extends BaseRouteInterface {
  children: {
    create: BaseRouteInterface,
  }
}

interface SettingsRouteInterface extends BaseRouteInterface {
  children: {
    upsert: BaseRouteInterface,
  }
}
