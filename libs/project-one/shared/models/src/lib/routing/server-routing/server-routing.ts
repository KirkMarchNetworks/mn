import { ServerRoutingInterface } from './models/_server-routing.interface';
import { routeCreator } from '../models/route-creator';

// TODO: Make ServerRouting an independent module, along with ClientRouting to save from Nx refreshes
export const ServerRouting: ServerRoutingInterface = {
  globalPrefix: routeCreator('api'),
  apiDocs: routeCreator('api-docs', () => ServerRouting.globalPrefix.absolutePath()),

  health: routeCreator('health', () => ServerRouting.globalPrefix.absolutePath()),

  tenant: {
    ...routeCreator('tenant', () => ServerRouting.globalPrefix.absolutePath()),
    children: {
      create: routeCreator('create', () => ServerRouting.tenant.absolutePath()),
      createWithDefaults: routeCreator('create-with-defaults', () => ServerRouting.tenant.absolutePath()),
      delete: routeCreator('delete', () => ServerRouting.tenant.absolutePath())
    }
  },

  licensedProduct: {
    ...routeCreator('licensed-product', () => ServerRouting.globalPrefix.absolutePath()),
    children: {
      create: routeCreator('create', () => ServerRouting.licensedProduct.absolutePath()),
    }
  },

  license: {
    ...routeCreator('license', () => ServerRouting.globalPrefix.absolutePath()),
    children: {
      addEvLicense: routeCreator('add-ev-license', () => ServerRouting.licensedProduct.absolutePath()),
    }
  },

  role: {
    ...routeCreator('role', () => ServerRouting.globalPrefix.absolutePath()),
    children: {
      create: routeCreator('create', () => ServerRouting.role.absolutePath()),
      delete: routeCreator('delete', () => ServerRouting.role.absolutePath())
    }
  },

  auth: {
    ...routeCreator('auth', () => ServerRouting.globalPrefix.absolutePath()),
    children: {
      login: routeCreator('login', () => ServerRouting.auth.absolutePath()),
      forgotPassword: routeCreator('forgot-password', () => ServerRouting.auth.absolutePath()),
      resetPassword: routeCreator('reset-password', () => ServerRouting.auth.absolutePath()),
      updateEmail: routeCreator('update-email', () => ServerRouting.auth.absolutePath()),
      confirmEmail: routeCreator('confirm-email', () => ServerRouting.auth.absolutePath()),
      createUser: routeCreator('create-user', () => ServerRouting.auth.absolutePath()),
    }
  },

  file: {
    ...routeCreator('file', () => ServerRouting.globalPrefix.absolutePath()),
    children: {
      tus: routeCreator('multi-upload', () => ServerRouting.file.absolutePath()),
    }
  },

  user: {
    ...routeCreator('user', () => ServerRouting.globalPrefix.absolutePath()),
    children: {
      delete: routeCreator('delete', () => ServerRouting.user.absolutePath()),
    }
  },

  intelligentRetrieval: {
    ...routeCreator('intelligent-retrieval', () => ServerRouting.globalPrefix.absolutePath()),
    children: {
      getImage: routeCreator('get-image', () => ServerRouting.intelligentRetrieval.absolutePath()),
      upload: routeCreator('upload', () => ServerRouting.intelligentRetrieval.absolutePath()),
      getSearchQueries: routeCreator('get-search-queries', () => ServerRouting.intelligentRetrieval.absolutePath()),
      createSearchQuery: routeCreator('create-search-query', () => ServerRouting.intelligentRetrieval.absolutePath()),
      multiUpload: routeCreator('multi-upload', () => ServerRouting.intelligentRetrieval.absolutePath()),
      textSearch: routeCreator('text-search', () => ServerRouting.intelligentRetrieval.absolutePath()),
      imageSearch: routeCreator('image-search', () => ServerRouting.intelligentRetrieval.absolutePath()),
      settings: routeCreator('settings', () => ServerRouting.intelligentRetrieval.absolutePath()),
      imageCount: routeCreator('image-count', () => ServerRouting.globalPrefix.absolutePath()),
      events: {
        ...routeCreator('events', () => ServerRouting.intelligentRetrieval.absolutePath()),
        children: {
          create: routeCreator('create', () => ServerRouting.intelligentRetrieval.children.events.absolutePath())
        }
      },
    }
  },

  deviceAndChannel: {
    ...routeCreator('device-and-channel', () => ServerRouting.globalPrefix.absolutePath()),
    children: {
      createDevice: routeCreator('create-device', () => ServerRouting.deviceAndChannel.absolutePath()),
      createChannel: routeCreator('create-channel', () => ServerRouting.deviceAndChannel.absolutePath()),
    }
  },
}
