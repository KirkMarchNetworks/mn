import { UserEntity } from '@mn/project-one/shared/api-client';
import { SortSearchInterface } from '../models/sort-search.interface';

export const UserEntitySearchable: SortSearchInterface<UserEntity> = {
  sort: {
    'publicId': {
      displayName: 'publicId'
    },
    'username': {
      displayName: 'username'
    },
    'email': {
      displayName: 'email'
    },
    'role.name': {
      displayName: 'roleName'
    }
  },
  search: {
    'publicId': {
      displayName: 'publicId',
      dbType: 'string'
    },
    'username': {
      displayName: 'username',
      dbType: 'string'
    },
    'email': {
      displayName: 'email',
      dbType: 'string'
    },
    'role.name': {
      displayName: 'roleName',
      dbType: 'string'
    },
    'enabled': {
      displayName: 'enabled',
      dbType: 'boolean'
    }
  }
}
