import { AuthRouteInterface } from './auth-route.interface';
import { BaseRouteInterface } from '../../models/base-route.interface';
import { TenantRouteInterface } from './tenant-route.interface';
import { RoleRouteInterface } from './role-route.interface';
import { UserRouteInterface } from './user-route.interface';
import { IntelligentRetrievalRouteInterface } from './intelligent-retrieval-route.interface';
import { LicenseRouteInterface } from './license-route.interface';
import { LicensedProductRouteInterface } from './licensed-product-route.interface';
import { FileRouteInterface } from './file-route.interface';
import { DeviceAndChannelRouteInterface } from './device-and-channel-route.interface';

export interface ServerRoutingInterface {
  globalPrefix: BaseRouteInterface;
  apiDocs: BaseRouteInterface;

  tenant: TenantRouteInterface;
  license: LicenseRouteInterface;
  licensedProduct: LicensedProductRouteInterface;
  role: RoleRouteInterface;
  auth: AuthRouteInterface;
  user: UserRouteInterface;
  file: FileRouteInterface;
  health: BaseRouteInterface;
  intelligentRetrieval: IntelligentRetrievalRouteInterface;
  deviceAndChannel: DeviceAndChannelRouteInterface;
}
