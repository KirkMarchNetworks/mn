import { DbSearchDataType } from '@mn/project-one/shared/sort-search-page';
import { FilterDialogResponseInterface } from './filter-dialog-response.interface';

export interface FilterDialogDataInterface {
  filterName: string;
  filterField: string;
  filterType: DbSearchDataType;
  activeFilters: FilterDialogResponseInterface[];
}
