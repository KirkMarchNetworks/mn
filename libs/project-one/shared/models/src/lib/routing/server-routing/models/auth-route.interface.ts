import { BaseRouteInterface } from '../../models/base-route.interface';

export interface AuthRouteInterface extends BaseRouteInterface {
  children: {
    login: BaseRouteInterface,
    forgotPassword: BaseRouteInterface,
    resetPassword: BaseRouteInterface,
    confirmEmail: BaseRouteInterface,
    updateEmail: BaseRouteInterface,
    createUser: BaseRouteInterface
  }
}
