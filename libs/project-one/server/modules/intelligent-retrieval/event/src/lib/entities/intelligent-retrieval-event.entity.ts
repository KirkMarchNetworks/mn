import { IntelligentRetrievalEventsType } from '@mn/project-one/server/repos/intelligent-retrieval';
import { SearchQueryEntity } from '@mn/project-one/server/modules/intelligent-retrieval/shared';

export class IntelligentRetrievalEventEntity
  implements IntelligentRetrievalEventsType
{
  /**
   * The I.D of the Intelligent Retrieval Event.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The name of the event.
   * @example 'Event 1'
   */
  name!: string;
  /**
   * The minimum similarity score threshold.
   * @example '30'
   */
  similarityScore!: number;
  /**
   * The time the event was created.
   * @example '2024-09-19T14:54:11.287Z'
   */
  createdAt!: Date;
  /**
   * The last time the event was updated.
   * @example '2024-09-19T14:54:11.287Z'
   */
  updatedAt!: Date;
  /**
   * The related search query.
   */
  searchQuery!: SearchQueryEntity;
}
