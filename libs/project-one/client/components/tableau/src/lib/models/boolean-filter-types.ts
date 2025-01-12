import { SearchBooleanFilters } from "@mn/project-one/shared/sort-search-page";

export const BooleanFilterTypes: Record<typeof SearchBooleanFilters[number], string> = {
  equals: $localize`Equals`,
  not: $localize`Not`
}
