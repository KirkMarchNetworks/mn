import { BaseRouteInterface } from '../../models/base-route.interface';
import { ImagesRouteInterface } from './images-route.interface';
import { UserManagementRouteInterface } from './user-management-route.interface';
import { SuperAdminRouteInterface } from './super-admin-route.interface';
import { SettingsRouteInterface } from './settings-route.interface';

export interface ClientRoutingInterface {
  login: BaseRouteInterface;
  logout: BaseRouteInterface;
  forgotPassword: BaseRouteInterface;
  about: BaseRouteInterface;
  main: BaseRouteInterface;
  superAdmin: SuperAdminRouteInterface;
  settings: SettingsRouteInterface;
  userManagement: UserManagementRouteInterface;
  intelligentRetrieval: ImagesRouteInterface;
}
