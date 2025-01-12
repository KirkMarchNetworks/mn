import { Prisma } from '@prisma/project-one/one'

type AuthorizedSearchTerms = Pick<Prisma.StringFilter,
  'startsWith' |
  'endsWith' |
  'contains' |
  'equals' |
  'not'>;

export const SearchStringFilters: Array<keyof AuthorizedSearchTerms> = [
  'startsWith',
  'endsWith',
  'contains',
  'equals',
  'not'
];
