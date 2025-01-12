import { BaseRouteInterface } from '../../models/base-route.interface';

export interface SuperAdminRouteInterface extends BaseRouteInterface {
  children: {
    tenantManagement: TenantManagementRouteInterface
  }
}

interface TenantManagementRouteInterface extends BaseRouteInterface {
  children: {
    add: BaseRouteInterface;
  }
}
