import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2, TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  skip as skippy,
  Subscription,
  switchMap
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { TableauColumnInterface } from './models/tableau-column.interface';
import { FilterDialogResponseInterface } from './components/filter-dialog/models/filter-dialog-response.interface';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogDataInterface } from './components/filter-dialog/models/filter-dialog-data.interface';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { ColumnSortingDialogComponent } from './components/column-sorting-dialog/column-sorting-dialog.component';
import { deleteAllPages, setCurrentPage } from '@ngneat/elf-pagination';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { extractSearchFields, extractSortFields } from '@mn/project-one/shared/sort-search-page';
import { TableauInput } from './models/tableau-input';
import { TableauQueryParamsInterface } from './models/tableau-query-params.interface';
import { HiddenExpandDirective } from "./directives/hidden-expand.directive";
import { ExpandDirective } from "./directives/expand.directive";
import { TableauClickInterface } from "./models/tableau-click.interface";
import { DataComponentInterface } from "./models/data-component.interface";
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatChip, MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatRow,
  MatTable,
  MatTableModule
} from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { DoubleClickDirective } from '@mn/project-one/client/directives/double-click';
import { NgLetDirective } from './directives/ng-let.directive';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatDateFormats } from '@angular/material/core';

@Component({
  selector: 'lib-tableau',
  standalone: true,
  imports: [
    CommonModule,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatChipListbox,
    MatChipsModule,
    MatTooltip,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCheckbox,
    MatHeaderCellDef,
    MatCell,
    HiddenExpandDirective,
    ExpandDirective,
    MatHeaderRow,
    MatRow,
    DoubleClickDirective,
    MatPaginator,
    MatMenuContent,
    RouterLink,
    MatSortHeader,
    NgLetDirective,
    MatTableModule,
  ],
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss'],
  animations: [
    trigger('detailVerticalExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('detailHorizontalExpand', [
      state('collapsed', style({width: '0px', minHeight: '0'})),
      state('expanded', style({width: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableauComponent<T extends object> implements OnInit, AfterViewInit, OnDestroy {

  // We can assume this is NOT undefined because we throw an error OnInit if not passed in.
  @Input({ required: true }) tableau!: TableauInput<T>;
  @Input() topZero = false;

  @ViewChild('topBar', { read: ViewContainerRef }) topBarRef!: ViewContainerRef;
  @ViewChild('bottomBar', { read: ViewContainerRef }) bottomBarRef!: ViewContainerRef;

  @ViewChild('extraMenuItemStart', { read: ViewContainerRef }) extraMenuItemStartRef!: ViewContainerRef;
  @ViewChild('extraMenuItemEnd', { read: ViewContainerRef }) extraMenuItemEndRef!: ViewContainerRef;

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('moreMenuHost', { read: ViewContainerRef }) moreMenuRef!: ViewContainerRef;
  @ViewChildren('moreMenuTrigger') moreMenus!: QueryList<MatMenuTrigger>;

  @ViewChildren(ExpandDirective) expandHost!: QueryList<ExpandDirective>;
  @ViewChildren(HiddenExpandDirective) hiddenExpandHost!: QueryList<HiddenExpandDirective>;

  private _expandedSubject = new BehaviorSubject<{ element: T, viewContainerRef: ViewContainerRef, hiddenViewContainerRef: ViewContainerRef, resizeObserver: ResizeObserver, scrollEvent: () => void} | null>(null);
  expanded$ = this._expandedSubject.asObservable();
  expandedElement$ = this.expanded$.pipe(
    map(expanded => expanded?.element),
    shareReplay(1)
  );

  private _visibleData: T[] = [];
  private _idKey = 'id';

  private _triggerRefreshSubject = new BehaviorSubject(null);
  private _triggerRefresh$!: Observable<[null, null]>;

  private _displayColumnsSubject = new BehaviorSubject<string[]>([])
  displayedColumns$ = this._displayColumnsSubject.asObservable();

  resultsLength$!: Observable<number>;

  pageIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator|undefined;
  @ViewChild(MatSort) sort: MatSort|undefined;

  selection!: SelectionModel<T>;
  private _lastSelectedIndex: number|null = null;

  private abortController = new AbortController();

  private _subscriptions = new Subscription();

  showFilterBubbles = false;
  private filtersSubject = new BehaviorSubject<FilterDialogResponseInterface[]>([]);
  filters$ = this.filtersSubject.asObservable();
  activeFilter = (column: TableauColumnInterface<any>) => this.filters$.pipe(
    map(filters => {
      return filters.some(x => x.field === column.columnDef);
    })
  );

  private sortSubject = new BehaviorSubject<Sort>({ active: '', direction: '' });
  sort$ = this.sortSubject.asObservable();

  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private renderer = inject(Renderer2);

  onSingleClick(click: TableauClickInterface<T>) {
    // console.log('Single Click', click.ev);
    if (this.selection.hasValue()) {
      // If ctr/cmd key is being held
      if (click.ev.ctrlKey || click.ev.metaKey) {
        // Toggle the new without clearing selection
        this._selectionToggle(click.entity, click.dataIndex);

        // Else if shift key is being held
      } else if (click.ev.shiftKey) {
        // console.log(this._visibleData[click.dataIndex]);
        this._selectionToggle(click.entity, click.dataIndex, true,false);

        // Else no special key was held down so
      } else {
        // Clear all previous selections and toggle the new selection
        this._selectionToggle(click.entity, click.dataIndex, false,true);
      }
      // console.log('One selected');
    } else {
      this._selectionToggle(click.entity, click.dataIndex);
    }
  }

  private _selectionToggle(entity: T, index: number, toggleMany = false, clearAll = false) {
    if (clearAll) {
      this.selection.clear();
      this._lastSelectedIndex = null;
    }

    if (toggleMany && this._lastSelectedIndex !== null) {
      // Means we need to descend
      if (this._lastSelectedIndex > index) {
        for (let i = this._lastSelectedIndex; i > index; i--) {
          this.selection.select(this._visibleData[i]);
        }
      } else {
        for (let i = this._lastSelectedIndex; i < index; i++) {
          this.selection.select(this._visibleData[i]);
        }
      }
    }

    const entitySelected = this.selection.isSelected(entity);

    // Means we are unselected the current
    if (entitySelected) {
      this.selection.deselect(entity);
    } else {
      this.selection.select(entity);
    }

    this._lastSelectedIndex = index;
  }

  onDoubleClick(click: TableauClickInterface<T>) {
    console.log('Double Click');
    this.tableau.onDoubleClick(click);
  }
  isElementExpanded(element: T) {
    const expanded = this._expandedSubject.value;

    if (expanded) {
      return expanded.element === element;
    }
    return false;
  }

  triggerRefresh() {
    this._triggerRefreshSubject.next(null);
  }

  trackTask(index: number, item: any): string {
    return `${item[this._idKey]}`;
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  openMoreMenu(ev: MouseEvent, item: T, index: number) {
    ev.stopPropagation();

    const moreMenu = this.moreMenus.get(index);

    if (moreMenu) {
      if (this.tableau.actionComponentMenu) {
        this.moreMenuRef.clear();
        const customMoreMenuRef = this.moreMenuRef.createComponent<DataComponentInterface<T>>(this.tableau.actionComponentMenu);
        customMoreMenuRef.instance.data = item;
      }

      moreMenu.menuData = { item };
      moreMenu.openMenu();
    }
  }

  handleExpand(ev: MouseEvent, item: T, index: number) {
    ev.stopPropagation();

    // The goal of the expand component is to expand to the visible width of the table
    // When table width is greater than screen size, table becomes horizontally scrollable
    // The expand component becomes hard to view in that case, especially when they're action buttons on the far right
    // The goal of the following code in this method, is to make the expand component the width of the visible table, even if it's scrollable
    // The way we have done this is setting the hiddenExpand component as relative and turning the css visibility to hidden
    // By doing this sets the proper height for the component
    // Our non hiddenExpandHost then gets an absolute position, where it's left value is set to the scroll left of the table
    // By doing this our component always stays perfectly in view :)
    const hiddenExpandHost = this.hiddenExpandHost.get(index);
    const expandHost = this.expandHost.get(index);

    if (hiddenExpandHost && expandHost) {

      // If an expandedSubject has a value
      if (this._expandedSubject.value) {
        const { scrollEvent, resizeObserver, viewContainerRef, hiddenViewContainerRef} = this._expandedSubject.value;
        // Clear all listeners and all old view containers
        resizeObserver.disconnect();
        scrollEvent();
        hiddenViewContainerRef.clear();
        viewContainerRef.clear();
      }

      let clearValue = true;
      if (! this.isElementExpanded(item)) {
        // If an expandable component has been passed into the Tableau Input
        if (this.tableau.expandComponent) {
          // Get the viewContainerRef of our directive (Where we will be injecting the expandComponent
          const expandViewContainerRef = expandHost.viewContainerRef;
          // Get the viewContainerRef of our hidden directive (Where we will be injecting the expandComponent
          const hiddenExpandViewContainerRef = hiddenExpandHost.viewContainerRef;

          const componentRef = expandViewContainerRef.createComponent<DataComponentInterface<T>>(this.tableau.expandComponent);
          const hiddenComponentRef = hiddenExpandViewContainerRef.createComponent<DataComponentInterface<T>>(this.tableau.expandComponent);
          componentRef.instance.data = item;
          hiddenComponentRef.instance.data = item;

          const hiddenParentNode = this.renderer.parentNode(hiddenComponentRef.location.nativeElement);
          const parentNode = this.renderer.parentNode(componentRef.location.nativeElement);
          const clientWidth = this.tableContainer.nativeElement.clientWidth + 'px';
          this.renderer.setStyle(hiddenParentNode, 'width', clientWidth);
          this.renderer.setStyle(parentNode, 'width', clientWidth);

          let lastKnownScrollLeftPosition = this.tableContainer.nativeElement.scrollLeft;
          this.renderer.setStyle(parentNode, 'left', lastKnownScrollLeftPosition + 'px');

          const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
              const contentRectWidth = entry.contentRect.width + 'px';
              this.renderer.setStyle(hiddenParentNode, 'width', contentRectWidth);
              this.renderer.setStyle(parentNode, 'width', contentRectWidth);
            }
          });
          resizeObserver.observe(this.tableContainer.nativeElement);

          let tickling = false;
          const scrollEvent = this.renderer.listen(this.tableContainer.nativeElement, 'scroll', ev => {
            if (ev.target instanceof Element) {
              lastKnownScrollLeftPosition = ev.target.scrollLeft;

              if (!tickling) {
                requestAnimationFrame(() => {
                  this.renderer.setStyle(parentNode, 'left', lastKnownScrollLeftPosition + 'px');
                  tickling = false;
                })
                tickling = true;
              }
            }
          })

          this._expandedSubject.next({
            element: item,
            viewContainerRef: expandViewContainerRef,
            hiddenViewContainerRef: hiddenExpandViewContainerRef,
            resizeObserver,
            scrollEvent
          });

          clearValue = false;
        }
      }
      if (clearValue) {
        this._expandedSubject.next(null);
      }
    }
  }

  private _computeDisplayedColumns() {
    if (this.tableau) {
      const columns: string[] = this.tableau.selectedColumns.map(c => c.columnDef);

      if (this.tableau.selection.canSelect && this.tableau.selection.selectionDisplay === 'checkbox') {
        columns.unshift('selectHeader');
      }

      if (this.tableau.hasExpand) {
        columns.push('expand');
      }

      if (this.tableau.hasActions) {
        columns.push('actionHeader');
      }



      this._displayColumnsSubject.next(columns);
    }
  }

  getIconName(column: TableauColumnInterface<T>, element: T) {
    if (column.icon) {
      return column.icon(element);
    }
    return ''
  }

  getCellDisplay(column: TableauColumnInterface<T>, element: T) {
    const textToDisplay = column.cell(element);
    if (column.limitCellLength && textToDisplay.length > column.limitCellLength) {
      return textToDisplay.substring(0, column.limitCellLength) + '...';
    }
    return textToDisplay;
  }

  rowHasTooltipDisabled(column: TableauColumnInterface<T>, element: T) {
    if (!column.showTooltip) {
      return true;
    }
    return !column.showTooltip(element);
  }

  ngOnInit() {
    if (! this.tableau) {
      throw new Error('A tableau interface must be supplied to work.');
    }

    this._subscriptions.add(
      this.tableau.data$.subscribe(data => this._visibleData = data)
    );

    if (this.tableau.selection && this.tableau.selection.selectionModel) {
      if (this.tableau.selection.selectionModel) {
        this.selection = this.tableau.selection.selectionModel;
      }
    } else {
      this.selection = new SelectionModel<T>(true, []);
    }

    if (this.tableau.service) {
      const { take, skip } = this._extractQueryParams<null>(this.route.snapshot.queryParamMap, null);

      // Set up the initial query params if take or skip equal null
      // There must always be a skip and a take in the query
      if (take === null || skip === null) {
        // First load of the page, so just replaceUrl
        this._updateQueryParams({
          take: take !== null ? take : this.tableau.pageSize,
          skip: skip !== null ? skip : 0,
        }, true);
      }
    }

    if (this.tableau.service) {
      this.resultsLength$ = this.tableau.service.resultsLength$;
    } else {
      this.resultsLength$ = new BehaviorSubject(0);
    }

    this._idKey = this.tableau.idKey;

    this.tableau.selectedColumns = this.tableau.columns.filter(x => {
      if (x.hide !== undefined) {
        return ! x.hide;
      } else {
        return true;
      }
    })
    this._computeDisplayedColumns();

    // Subscribe to queryParamMap changes
    // This is our single source of truth for sorting, filtering, taking and skipping or any other query params that need to be listened for
    this._subscriptions.add(
      this.route.queryParamMap.subscribe(queryParamMap => {
        return this._handleQueryParamMapEvent(queryParamMap)
      })
    );

    this._triggerRefresh$ = combineLatest([
      this._triggerRefreshSubject.asObservable(),
      of(null)
    ]);

    if (this.tableau.service) {
      this._triggerRefresh$ = combineLatest([
        this._triggerRefreshSubject.asObservable(),
        this.tableau.service.triggerRefresh$
      ]);
    }

    // TODO: FIX THIS
    // If a refresh is triggered, we delete all cached pages and a new request is triggered
    this._subscriptions.add(
      this._triggerRefresh$.pipe(
        skippy(1)
      ).subscribe(() => {
        this._deleteAllCachedPages();
        this.tableau.onRefresh();
      })
    );
  }

  private _deleteAllCachedPages() {
    this.tableau.service?.derivedService.store.update(
      deleteAllPages()
    );
  }

  private _handleQueryParamMapEvent(queryParamMap: ParamMap) {
    // Extract the query params we need
    const params = this._extractQueryParams<null>(queryParamMap, null);
    const { take, skip, sort, search, pageIndex } = params;

    // We only want to update this after the first time as Pagination component is only available afterViewInit
    if (this.tableau.lastQueryParams !== null && this.tableau.lastQueryParams.skip !== skip) {
      this.tableau.service?.derivedService.store.update(
        setCurrentPage(pageIndex)
      )
      this.pageIndex = pageIndex;
    }

    let additional: TableauQueryParamsInterface['additional'] = {};

    const additionalQueryParamsChanged = (params?: TableauQueryParamsInterface) => {
      let returnValue = false;
      if (params) {
        // TODO: This needs a rework
        // When search query exists on init, then it's removed, then re-added it fails to update
        if (params.additional) {
          for (const [key, value] of Object.entries(params.additional)) {
            if (queryParamMap.has(key)) {
              const paramValue = queryParamMap.get(key)!;
              if (value !== paramValue) {
                returnValue = true;
              }
              if (additional) {
                additional[key] = paramValue;
              }
              // The query param has been removed from previous search
            } else {
              if (additional) {
                additional[key] = '';
              }
              returnValue = true;
            }
          }
        }
      } else {
        if (Object.keys(this.tableau.additionalQueryParams).length) {
          for (const [key] of Object.entries(this.tableau.additionalQueryParams)) {
            if (additional) {
              let value = '';
              if (queryParamMap.has(key)) {
                value = queryParamMap.get(key)!;
              }
              additional[key] = value;
            }
          }
        } else {
          additional = undefined;
        }
      }

      return returnValue;
    }

    if (this.tableau.lastQueryParams === null) {
      additionalQueryParamsChanged();
    }

    // If any other change besides skip has taken place
    if (
      this.tableau.lastQueryParams === null ||
      additionalQueryParamsChanged(this.tableau.lastQueryParams) ||
      this.tableau.lastQueryParams.take !== take ||
      this.tableau.lastQueryParams.search !== search ||
      this.tableau.lastQueryParams.sort !== sort
    ) {
      this._deleteAllCachedPages();
      this._updateFilterSubjectAfterQueryParams(search);
      this._updateSortSubjectAfterQueryParams(sort);
    }

    // Save the new queryParams for next iteration
    this.tableau.lastQueryParams = {
      take,
      skip,
      sort,
      search,
      additional
    }
  }

  isSortable(column: TableauColumnInterface<any>) {
    return !!column.sortable;
  }

  isFilterable(column: TableauColumnInterface<any>) {
    return !!column.searchable;
  }
  /**
   * Opens the column sorter / column definitions
   */
  openColumnSorter() {
    this._subscriptions.add(
      this._columnSorter$(this.tableau).subscribe(updated => {
        if (updated) {
          this._computeDisplayedColumns();
        }
      })
    );
  }

  /**
   * Opens the column sorter / column definitions dialog
   */
  private _columnSorter$(data: TableauInput<T>) {
    const dialogRef = this.dialog.open<ColumnSortingDialogComponent, TableauInput<T>, boolean>(ColumnSortingDialogComponent, {
      width: '750px',
      data
    });
    return dialogRef.afterClosed()
  }

  removeAllFilters() {
    this._updateQueryParams({ search: undefined, skip: 0 });
  }

  removeFilter(filter:  FilterDialogResponseInterface) {
    this._handleFilterApplication({
      ...filter,
      filter: null
    });
  }

  private _handleFilterApplication(filter:  FilterDialogResponseInterface) {
    const currentFilters = this.filtersSubject.getValue();
    // Remove any previous filter for that column
    const newFilters = currentFilters.filter(x => x.field !== filter.field);

    if (filter.filter !== null) {
      // Now add the new filter
      newFilters.push(filter);
    }

    // We need to figure out if the filters differ from what the previous filters were
    let anyDifferences: boolean;
    if (newFilters.length !== currentFilters.length) {
      anyDifferences = true;
    } else {
      const everyElementTheSame = newFilters.every(x => {
        const filter = currentFilters.find(y => y.field === x.field);
        if (filter) {
          return filter.filter === x.filter;
        }
        return false;
      });
      anyDifferences = !everyElementTheSame;
    }

    // If there are any differences we need to set the current page to 0 by setting skip to 0 and updating the search query param
    if (anyDifferences) {
      let search: string|null = null;

      if (newFilters.length) {
        search = '';
        for (const [i, filter] of newFilters.entries()) {
          search += `${filter.field}:${filter.filter}`;
          if (i !== newFilters.length - 1) {
            search += ','
          }
        }
      }

      this._updateQueryParams({ search, skip: 0 });
    }
  }

  /**
   * Called when a user clicks on the filter icon for a specific column.
   */
  openFilterDialog(e: Event, column: TableauColumnInterface<T>) {
    // We need to stop propagation so sorting also does not get triggered when filter button is clicked
    e.stopPropagation();

    // We technically know this exist because this method would be unavailable if it wasn't
    if (column.searchable) {
      const value = this.tableau.sortSearch.search[column.searchable.key];

      if (!value) {
        throw new Error(`Search key: ${column.searchable.key} does not exist.`);
      }

      this._subscriptions.add(
        this._openFilterDialog({
          filterField: column.columnDef,
          filterName: value.displayName,
          filterType: value.dbType,
          activeFilters: this.filtersSubject.getValue(),
        }).subscribe(filter => {
          if (filter) {
            this._handleFilterApplication(filter)
          }
        })
      );
    }
  }

  /**
   * Opens the filter dialog for a specific column
   */
  private _openFilterDialog(data: FilterDialogDataInterface) {
    // Unsaved changes, confirm data loss before navigating
    const dialogRef = this.dialog.open<FilterDialogComponent, FilterDialogDataInterface, FilterDialogResponseInterface>(FilterDialogComponent, {
      width: '650px',
      data
    });
    return dialogRef.afterClosed()
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(items: any[]) {
    const numSelected = this.selection.selected.length;
    const numRows = items.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(items: any[]) {
    if (this.isAllSelected(items)) {
      this.selection.clear();
      return;
    }

    this.selection.select(...items);
  }

  private _updateFilterSubjectAfterQueryParams(search: string | null) {
    try {
      if (search === null) {
        search = '';
      }

      const searches = extractSearchFields(search, this.tableau.sortSearch.search);

      const filters: FilterDialogResponseInterface[] = searches.map(search => ({
        field: search.field,
        filter: `${search.term}:${search.value}`,
      }))

      this.filtersSubject.next(filters);
    } catch (e) {
      console.error(e);
    }
  }

  private _updateSortSubjectAfterQueryParams(sort: string | null) {
    try {
      if (sort === null) {
        sort = '';
      }
      const sorts = extractSortFields(sort, this.tableau.sortSearch.sort);

      if (sorts.length) {
        const firstSort = sorts[0];
        this.sortSubject.next({ active: firstSort.field, direction: firstSort.by })
      } else {
        this.sortSubject.next({ active: '', direction: '' })
      }
    } catch (e) {
      console.error(e);
    }
  }

  private _extractQueryParams<T = null | undefined>(queryParamMap: ParamMap, nullOrUndefined: T) {

    let take: number | T = nullOrUndefined;
    if (queryParamMap.has('take')) {
      take = +queryParamMap.get('take')!;
      this.tableau.pageSize = take;
    }

    let skip: number | T = nullOrUndefined;
    if (queryParamMap.has('skip')) {
      skip = +queryParamMap.get('skip')!;
    }

    let sort: string | T = nullOrUndefined;
    if (queryParamMap.has('sort')) {
      sort = queryParamMap.get('sort')!;
    }

    let search: string | T = nullOrUndefined;
    if (queryParamMap.has('search')) {
      search = queryParamMap.get('search')!;
    }

    const additionalParams: { [key: string ]: string } = {};
    for (const key of Object.keys(this.tableau.additionalQueryParams)) {
      if (queryParamMap.has(key)) {
        additionalParams[key] = queryParamMap.get(key)!;
      }
    }

    let pageIndex = 0;
    if (typeof take === 'number' && typeof skip === 'number') {
      pageIndex = skip / take;
    }

    return {
      take,
      skip,
      sort,
      search,
      pageIndex,
      ...additionalParams
    }
  }

  private _handlePaginatorEvent(pageEvent: PageEvent) {
    let skip = 0;
    // TODO: Eventually you can probably remap the pages if the pageEvent.pageSize < this.pageSize.
    if (pageEvent.pageSize === this.tableau.pageSize) {
      skip = pageEvent.pageIndex * pageEvent.pageSize
    }
    this._updateQueryParams({
      take: pageEvent.pageSize,
      skip
    });
  }

  private _handleSortChangeEvent(sortEvent: Sort) {
    let sort = null;
    if (sortEvent.direction !== "") {
      sort = `${sortEvent.active}:${sortEvent.direction === 'asc' ? 'asc' : 'desc'}`
    }
    this._updateQueryParams({ sort, skip: 0 });
  }

  private _updateQueryParams(queryParams: Partial<TableauQueryParamsInterface>, replaceUrl = false) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl
    })
  }

  ngAfterViewInit() {
    if (this.tableau.filters.topComponent) {
      this.topBarRef.createComponent(this.tableau.filters.topComponent);
    }

    if (this.tableau.filters.bottomComponent) {
      this.bottomBarRef.createComponent(this.tableau.filters.bottomComponent);
    }

    if (this.tableau.menuItemStart) {
      this.extraMenuItemStartRef.createComponent(this.tableau.menuItemStart);
    }

    if (this.tableau.menuItemEnd) {
      this.extraMenuItemEndRef.createComponent(this.tableau.menuItemEnd);
    }

    if (this.sort && this.paginator) {

      // Handle paginator page events
      this._subscriptions.add(
        this.paginator.page.subscribe(pageEvent => this._handlePaginatorEvent(pageEvent))
      );

      // Handle sort change events
      this._subscriptions.add(
        this.sort.sortChange.subscribe(sortEvent => this._handleSortChangeEvent(sortEvent))
      );

      const { pageIndex } = this._extractQueryParams<null>(this.route.snapshot.queryParamMap, null);
      // Set the initial page index
      this.pageIndex = pageIndex;

      if (this.tableau.service) {
        this._subscriptions.add(
          combineLatest([
            this.route.queryParamMap,
            this._triggerRefresh$
          ]).pipe(
            switchMap(([ queryParamMap ]) => {
              this.selection.clear();

              // Extract the query params we need
              const params = this._extractQueryParams<undefined>(queryParamMap, undefined);

              if (this.tableau.service) {
                return this.tableau.service.findAll(params)
              }
              return of(null);
            }),
            catchError(err => {
              return err;
            })
          ).subscribe()
        );
      }
    }
  }
}
