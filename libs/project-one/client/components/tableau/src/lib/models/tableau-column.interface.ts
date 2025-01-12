import { ComponentInterface } from '@mn/project-one/client/models';
import { DataComponentInterface } from './data-component.interface';
import { SortSearchInterface } from '@mn/project-one/shared/sort-search-page';

export interface TableauColumnInterface<T extends object> {
  columnDef: string;
  header: string;
  cell: (element: T) => string;
  cellComponent?: {
    component: ComponentInterface<DataComponentInterface<unknown>>;
    // TODO: this should return the type defined in DataComponentInterface of the sibling property component
    input: (element: T) => any;
  }
  icon?: (element: T) => string;
  limitCellLength?: number;
  showTooltip?: (element: T) => boolean;
  hide?: boolean;
  sortable?: {
    key: keyof SortSearchInterface<T>['sort']
  };
  searchable?: {
    key: keyof SortSearchInterface<T>['search']
  };
}
