import { SearchIntFilters } from "@mn/project-one/shared/sort-search-page";

export const IntFilterTypes: Record<typeof SearchIntFilters[number], string> = {
  gt: $localize`Greater Than`,
  gte: $localize`Greater Than or Equal To`,
  lt: $localize`Less Than`,
  lte: $localize`Less Than or Equal To`,
  equals: $localize`Equals`
}
