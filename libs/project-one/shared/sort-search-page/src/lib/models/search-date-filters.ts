import { Prisma } from '@prisma/project-one/one'

type AuthorizedDateSearchTerms = Pick<Prisma.DateTimeFilter,
  'gt' |
  'gte' |
  'lt' |
  'lte' |
  'equals'>;

export const SearchDateFilters: Array<keyof AuthorizedDateSearchTerms>  = [
  'gt',
  'gte',
  'lt',
  'lte',
  'equals'
];
