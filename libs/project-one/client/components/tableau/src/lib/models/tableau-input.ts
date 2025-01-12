import { TableauColumnInterface } from '../models/tableau-column.interface';
import { TableauInterface } from '../models/tableau.interface';
import { TableauBaseService } from '../services/tableau-base.service';
import { TableauQueryParamsInterface } from './tableau-query-params.interface';
import {TableauActionType} from "./tableau-action.interface";
import {Observable, Subject} from "rxjs";
import {TableauSelectionInterface} from "./tableau-selection.interface";
import {TableauClickInterface} from "./tableau-click.interface";
import {TableauFilterInterface} from "./tableau-filter.interface";
import { Type } from "@angular/core";
import { FindAllParamsInterface, SortSearchInterface } from '@mn/project-one/shared/sort-search-page';
import { selectCurrentPageEntities } from '@ngneat/elf-pagination';

export class TableauInput<T extends object> {
  idKey = 'id';
  lastQueryParams: TableauQueryParamsInterface | null = null;
  columns: TableauColumnInterface<T>[];
  data$: Observable<T[]>;
  loadingResults$: Observable<boolean>;
  service: TableauBaseService<T> | undefined;

  sortSearch: SortSearchInterface<T>;

  selection: TableauSelectionInterface<T>;
  filters: TableauFilterInterface;
  menuItemStart: Type<any>|undefined;
  menuItemEnd: Type<any>|undefined;
  hasExpand = false;
  expandComponent;
  actionComponentMenu;
  hasActions: boolean;
  selectedColumns: TableauColumnInterface<T>[];
  actions: TableauActionType<T> = [];
  showPaginator = true;
  showFirstLastButtons = true;
  pageSizeOptions = [10, 20, 50, 100];
  pageSize = 100;
  additionalQueryParams: { [key: string]: undefined } = {};

  private _doubleClickSubject = new Subject<TableauClickInterface<T>>();
  doubleClick$ = this._doubleClickSubject.asObservable();

  private _refreshSubject = new Subject<null>();
  refresh$ = this._refreshSubject.asObservable();

  constructor(params: TableauInterface<T>) {
    this.columns = params.columns;
    // We don't want them to share the same variable references
    this.selectedColumns = this.columns.map(x => x);

    if (params.data$) {
      this.data$ = params.data$;
    } else if (params.service) {
      this.data$ = params.service.derivedService.store.pipe(selectCurrentPageEntities())
    } else {
      throw new Error('You must either pass 1 data$ param or 1 service param.');
    }

    if (params.loadingResults$) {
      this.loadingResults$ = params.loadingResults$;
    } else if (params.service) {
      this.loadingResults$ = params.service.isLoadingResults$;
    } else {
      throw new Error('You must either pass 1 loading$ param or 1 service param.');
    }

    this.service = params.service;

    if (params.sortSearch) {
      this.sortSearch = params.sortSearch;
    } else {
      this.sortSearch = { sort: {}, search: {} };
    }

    if (params.filters) {
      this.filters = params.filters;
    } else {
      this.filters = { showDefault: true }
    }

    if (params.selection) {
      this.selection = params.selection;
      // TODO: Fill in other non required fields
    } else {
      this.selection = {
        canSelect: true,
        selectionDisplay: 'checkbox',
        multiSelect: true
      }
    }

    if (params.expand) {
      if (params.expand.show !== undefined) {
        this.hasExpand = params.expand.show;
      }
      if (params.expand.component) {
        this.expandComponent = params.expand.component;
      }
    }

    if (params.actions) {
      this.hasActions = true;
      this.actions = params.actions;
    } else {
      this.hasActions = false
    }

    if (params.actionsComponentMenu) {
      this.hasActions = true;
      this.actionComponentMenu = params.actionsComponentMenu;
    }

    if (params.menuItemStart) {
      this.menuItemStart = params.menuItemStart;
    }

    if (params.menuItemEnd) {
      this.menuItemEnd = params.menuItemEnd;
    }

    if (params.paginator) {
      if (params.paginator.show !== undefined) {
        this.showPaginator = params.paginator.show;
      }
      if (params.paginator.showFirstLastButtons !== undefined) {
        this.showFirstLastButtons = params.paginator.showFirstLastButtons;
      }
      if (params.paginator.pageSizeOptions) {
        this.pageSizeOptions = params.paginator.pageSizeOptions;
      }
      if (params.paginator.pageSize) {
        this.pageSize = params.paginator.pageSize;
      }
    }

    if (params.idKey) {
      this.idKey = params.idKey;
    }

    if (params.additionalQueryParams) {
      this.additionalQueryParams = params.additionalQueryParams;
    }
  }

  onDoubleClick(click: TableauClickInterface<T>) {
    this._doubleClickSubject.next(click);
  }

  onRefresh() {
    this._refreshSubject.next(null);
  }
}
