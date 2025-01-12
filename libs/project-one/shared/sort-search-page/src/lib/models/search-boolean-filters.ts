import { Prisma } from '@prisma/project-one/one'

type AuthorizedBooleanSearchTerms = Prisma.BoolFilter;

export const SearchBooleanFilters: Array<keyof AuthorizedBooleanSearchTerms>  = [
  'equals', 'not'
];
