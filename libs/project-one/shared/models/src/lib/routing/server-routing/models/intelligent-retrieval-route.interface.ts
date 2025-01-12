import { BaseRouteInterface } from '../../models/base-route.interface';

export interface IntelligentRetrievalRouteInterface extends BaseRouteInterface {
  children: {
    getImage: BaseRouteInterface,
    upload: BaseRouteInterface,
    getSearchQueries: BaseRouteInterface,
    createSearchQuery: BaseRouteInterface,
    multiUpload: BaseRouteInterface,
    textSearch: BaseRouteInterface,
    imageSearch: BaseRouteInterface,
    imageCount: BaseRouteInterface,
    settings: BaseRouteInterface,
  }
}
