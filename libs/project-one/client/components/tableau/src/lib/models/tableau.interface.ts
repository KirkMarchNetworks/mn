import { Type } from '@angular/core';
import { TableauColumnInterface } from './tableau-column.interface';
import { TableauBaseService } from '../services/tableau-base.service';
import {DataComponentInterface} from "./data-component.interface";
import {TableauActionType} from "./tableau-action.interface";
import {Observable} from "rxjs";
import {TableauSelectionInterface} from "./tableau-selection.interface";
import {TableauFilterInterface} from "./tableau-filter.interface";
import { FindAllParamsInterface, SortSearchInterface } from '@mn/project-one/shared/sort-search-page';

export interface TableauInterface<T extends object> {
  // idKey should be passed if primary id on entity is not equal to 'id'
  idKey?: keyof T & string;
  columns: TableauColumnInterface<T>[];

  data$?: Observable<T[]>;
  loadingResults$?: Observable<boolean>;

  service?: TableauBaseService<T>;
  // You can tell the table to listen for additional query params
  additionalQueryParams?: { [key: string]: undefined },
  sortSearch?: SortSearchInterface<T>;
  selection?: TableauSelectionInterface<T>,
  filters?: TableauFilterInterface,
  menuItemStart?: Type<any>;
  menuItemEnd?: Type<any>;
  expand?: {
    // Whether to show the expand option
    show?: boolean;
    component: Type<DataComponentInterface<T>>
  },
  paginator?: {
    // Whether to show the paginator
    show?: boolean;
    showFirstLastButtons?: boolean;
    pageSizeOptions?: number[];
    pageSize?: number;
  },
  actionsComponentMenu?: Type<DataComponentInterface<T>>
  actions?: TableauActionType<T>
}
