import { SearchQueryWithVectorType } from '@mn/project-one/server/repos/repo-one-extensions';
import { IntelligentRetrievalEventsType } from './intelligent-retrieval-events.type';

export type IntelligentRetrievalEventWithSearchQueryType = IntelligentRetrievalEventsType & {
  searchQuery: SearchQueryWithVectorType;
}
