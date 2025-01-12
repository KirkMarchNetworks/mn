import { SearchDateFilters } from "@mn/project-one/shared/sort-search-page";

export const DateFilterTypes: Record<typeof SearchDateFilters[number], string> = {
  gt: $localize`Greater Than`,
  gte: $localize`Greater Than or Equal To`,
  lt: $localize`Less Than`,
  lte: $localize`Less Than or Equal To`,
  equals: $localize`Equals`
}
