import { IntelligentRetrievalEventEntity } from '@mn/project-one/shared/api-client';
import { SortSearchInterface } from '../models/sort-search.interface';

export const IntelligentRetrievalEventEntitySearchable: SortSearchInterface<IntelligentRetrievalEventEntity> =
  {
    sort: {
      similarityScore: {
        displayName: 'similarityScore',
      },
    },
    search: {
      'searchQuery.originalQuery': {
        displayName: 'originalQuery',
        dbType: 'string',
      },
    },
  };
