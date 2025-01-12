import { BaseRouteInterface } from '../../models/base-route.interface';

export interface UserManagementRouteInterface extends BaseRouteInterface {
  children: {
    users: UsersRouteInterface
    roles: RolesRouteInterface
  }
}

interface UsersRouteInterface extends BaseRouteInterface {
  children: {
    add: BaseRouteInterface;
  }
}

interface RolesRouteInterface extends BaseRouteInterface {
  children: {
    add: BaseRouteInterface;
  }
}
