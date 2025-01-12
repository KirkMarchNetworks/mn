import { Prisma } from '@prisma/project-one/one'

type AuthorizedIntSearchTerms = Pick<Prisma.IntFilter,
  'gt' |
  'gte' |
  'lt' |
  'lte' |
  'equals'>;

export const SearchIntFilters: Array<keyof AuthorizedIntSearchTerms>  = [
  'gt',
  'gte',
  'lt',
  'lte',
  'equals'
];
