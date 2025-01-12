import { PaginationInterface } from './models/pagination.interface';
import { SearchStringFilters } from './models/search-string-filters';
import { FindAllParamsInterface } from './models/find-all-params.interface';
import { DbSearchDataType } from './models/db-search-data-type';
import { SearchDateFilters } from './models/search-date-filters';
import { SearchIntFilters } from './models/search-int-filters';
import { SearchBooleanFilters } from './models/search-boolean-filters';
import { SearchValueInterface, SortSearchInterface, SortValueInterface } from './models/sort-search.interface';

export function extractSearchFields(search: string, data: SortSearchInterface<any>['search']): Required<Pick<PaginationInterface, 'search'>>['search'] {
  const finalSearch: PaginationInterface['search'] = [];

  if (search === '') {
    return finalSearch;
  }

  const searchArray = search.split(',');

  for (const val of searchArray) {
    const values = val.split(':');

    if (values.length < 3) {
      throw new Error('Invalid search field.');
    } else if (values.length > 3) {
      const time = values.slice(2).join(':');
      values.length = 3;
      values[2] = time;
    }

    const searchField = values[0];

    let dbType: DbSearchDataType|undefined;

    if (data) {
      let foundValue: SearchValueInterface | undefined = undefined;
      for (const value of Object.values(data)) {
        if (value) {
          if (value.displayName === searchField) {
            foundValue = value;
            break;
          }
        }
      }

      if (foundValue === undefined) {
        throw new Error('Invalid search field.');
      }

      dbType = foundValue.dbType;
    }

    const searchTerm = values[1];

    const validateSearchTerm = (filters: string[]) => {
      if (! filters.some(x => x === searchTerm)) {
        throw new Error('Invalid search term.');
      }
    }

    if (dbType) {
      switch (dbType) {
        case 'string':
          validateSearchTerm(SearchStringFilters);
          break;
        case 'date':
          validateSearchTerm(SearchDateFilters);
          break;
        case 'int':
          validateSearchTerm(SearchIntFilters);
          break;
        case 'boolean':
          validateSearchTerm(SearchBooleanFilters);
          break;
        default:
          throw new Error('Invalid search term.');
      }
    }

    // TODO: Do we need to add validation to this?
    let searchValue: string|number|boolean = values[2];

    if (dbType) {
      if (dbType === 'int') {
        searchValue = parseInt(searchValue);
        if (isNaN(searchValue)) {
          throw new Error('Invalid search value.');
        }
      }
      if (dbType === 'boolean') {
        if (searchValue !== 'true' && searchValue !== 'false') {
          throw new Error('Invalid search value.');
        } else {
          searchValue = searchValue === 'true';
        }
      }
    }

    finalSearch.push({
      field: searchField,
      term: searchTerm,
      value: searchValue
    });
  }

  return finalSearch;
}

export function extractSortFields(sort: string, data: SortSearchInterface<any>['sort']): Required<Pick<PaginationInterface, 'sort'>>['sort'] {
  const sortArray = sort.split(',');
  const finalSort: PaginationInterface['sort'] = [];

  for (const val of sortArray) {
    if (val === '') {
      continue;
    }

    const values = val.split(':');

    if (values.length !== 2) {
      throw new Error('Invalid sort field, requires 2.');
    }

    const sortField = values[0];
    const sortByDirection = values[1];

    if (sortByDirection !== 'asc' && sortByDirection !== 'desc') {
      throw new Error('Invalid sort value.');
    }

    if (data) {
      let foundValue: SortValueInterface | undefined = undefined;
      for (const value of Object.values(data)) {
        if (value) {
          if (value.displayName === sortField) {
            foundValue = value;
            break;
          }
        }
      }

      if (foundValue === undefined) {
        throw new Error('Invalid sort field.');
      }
    }

    finalSort.push({
      field: sortField,
      by: sortByDirection
    });
  }

  return finalSort;
}
