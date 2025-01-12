import { SearchStringFilters } from "@mn/project-one/shared/sort-search-page";

export const StringFilterTypes: Record<typeof SearchStringFilters[number], string> = {
  startsWith: $localize`Starts With`,
  contains: $localize`Contains`,
  equals: $localize`Equals`,
  endsWith: $localize`Ends With`,
  not: $localize`Not`
}
