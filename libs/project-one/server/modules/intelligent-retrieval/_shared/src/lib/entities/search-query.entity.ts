import { SearchQueryType } from '@mn/project-one/server/repos/repo-one-extensions';

export class SearchQueryEntity implements SearchQueryType {
  /**
   * The I.D of the search query.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  id!: string;
  /**
   * The I.D of the channel.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  lowerCaseQuery!: string | null;
  /**
   * The name of the file.
   * @example 'red-shirt'
   */
  originalQuery!: string | null;
  /**
   * The name of the file.
   * @example 'clx87e1s60003gs1l8kluxcct'
   */
  fileName!: string | null;
}
