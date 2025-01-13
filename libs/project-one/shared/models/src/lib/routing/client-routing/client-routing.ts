import { ClientRoutingInterface } from './models/_client-routing.interface';
import { routeCreator } from '../models/route-creator';

export const ClientRouting: ClientRoutingInterface = {
  login: routeCreator('login'),
  logout: routeCreator('logout'),
  forgotPassword: routeCreator('forgot-password'),
  about: routeCreator('about'),
  main: routeCreator(''),

  superAdmin: {
    ...routeCreator('super-admin'),
    children: {
      tenantManagement: {
        ...routeCreator('tenant-management', () => ClientRouting.superAdmin.absolutePath()),
        children: {
          add: routeCreator('add', () => ClientRouting.superAdmin.children.tenantManagement.absolutePath()),
        }
      },
    }
  },

  settings: {
    ...routeCreator('settings'),
    children: {
      menu: routeCreator('menu', () => ClientRouting.settings.absolutePath()),
    }
  },
  userManagement: {
    ...routeCreator('user-management'),
    children: {
      users: {
        ...routeCreator('users', () => ClientRouting.userManagement.absolutePath()),
        children: {
          add: routeCreator('add', () => ClientRouting.userManagement.children.users.absolutePath()),
        }
      },
      roles: {
        ...routeCreator('roles', () => ClientRouting.userManagement.absolutePath()),
        children: {
          add: routeCreator('add', () => ClientRouting.userManagement.children.roles.absolutePath()),
        }
      }
    }
  },

  intelligentRetrieval: {
    ...routeCreator('intelligent-retrieval'),
    children: {
      search: routeCreator('search', () => ClientRouting.intelligentRetrieval.absolutePath()),
      upload: routeCreator('upload', () => ClientRouting.intelligentRetrieval.absolutePath()),
      events: {
        ...routeCreator('events', () => ClientRouting.intelligentRetrieval.absolutePath()),
        children: {
          create: routeCreator('create', () => ClientRouting.intelligentRetrieval.children.events.absolutePath()),
        }
      },
      settings: routeCreator('settings', () => ClientRouting.intelligentRetrieval.absolutePath()),
    }
  },
}
