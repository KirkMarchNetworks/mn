import { RoleEntity } from '@mn/project-one/shared/api-client';
import { SortSearchInterface } from '../models/sort-search.interface';

export const RoleEntitySearchable: SortSearchInterface<RoleEntity> = {
  sort: {
    'id': {
      displayName: 'id'
    },
    'name': {
      displayName: 'name'
    },
  },
  search: {
    'id': {
      displayName: 'id',
      dbType: 'string'
    },
    'name': {
      displayName: 'name',
      dbType: 'string'
    },
  }
}
