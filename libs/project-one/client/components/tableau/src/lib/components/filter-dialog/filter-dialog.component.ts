import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy, signal,
  ViewChild
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { FilterDialogDataInterface } from './models/filter-dialog-data.interface';
import { FilterDialogResponseInterface } from './models/filter-dialog-response.interface';
import '@angular/localize/init';
import { StringFilterTypes } from '../../models/string-filter-types';
import { DateFilterTypes } from '../../models/date-filter-types';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent, MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import { Subject, Subscription } from 'rxjs';
import { IntFilterTypes } from '../../models/int-filter-types';
import { BooleanFilterTypes } from '../../models/boolean-filter-types';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import {
  MtxCalendarView,
  MtxDatetimepicker,
  MtxDatetimepickerActions,
  MtxDatetimepickerApply,
  MtxDatetimepickerCancel,
  MtxDatetimepickerClear,
  MtxDatetimepickerInput, MtxDatetimepickerMode,
  MtxDatetimepickerToggle, MtxDatetimepickerType
} from '@ng-matero/extensions/datetimepicker';
import { provideMomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { BaseFilterComponent } from './components/base-filter/base-filter.component';
import { StringFilterComponent } from './components/string-filter/string-filter.component';
import { DateFilterComponent } from './components/date-filter/date-filter.component';
import { IntFilterComponent } from './components/int-filter/int-filter.component';
import { BooleanFilterComponent } from './components/boolean-filter/boolean-filter.component';

type DatePickerInputType = 'input' | 'change';

@Component({
  selector: 'lib-filter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDivider,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    BaseFilterComponent,
    StringFilterComponent,
    DateFilterComponent,
    IntFilterComponent,
    BooleanFilterComponent
  ],
  templateUrl: './filter-dialog.component.html',
  styleUrls: [ './filter-dialog.component.scss' ],
  providers: [
    provideMomentDatetimeAdapter({
      parse: {
        dateInput: 'YYYY-MM-DD',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'YYYY-MM-DD HH:mm',
      },
      display: {
        dateInput: 'YYYY-MM-DD',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'YYYY-MM-DD HH:mm',
        monthYearLabel: 'YYYY MMMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
        popupHeaderDateLabel: 'MMM DD, ddd',
      },
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDialogComponent implements OnDestroy {
  @ViewChild('pickerInput', { read: ElementRef }) pickerInput: ElementRef<HTMLInputElement> | undefined;

  title = $localize`Filter`;
  hasActiveFilter = false;
  selected = '';
  value: Date | string = '';

  selectedFilter = new FormControl('', [ Validators.required ] )
  intValue = new FormControl('', [ Validators.required, Validators.pattern("^[0-9]*$") ]);
  stringValue = new FormControl('', [ Validators.required ]);
  booleanValue = new FormControl('', [ Validators.required ]);
  dateValue = new FormControl('', [ Validators.required ]);

  filterValue = signal<null | string>('');
  formValue = signal<null | string>('');

  type: MtxDatetimepickerType = 'datetime';
  mode: MtxDatetimepickerMode = 'auto';
  startView: MtxCalendarView = 'month';
  multiYearSelector = false;
  touchUi = false;
  twentyFourHour = false;
  timeInterval = 1;
  timeInput = true;

  private _subscriptions = new Subscription();

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent, FilterDialogResponseInterface>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogDataInterface,
  ) {
    if (! data) {
      throw new Error('A data object must be supplied to the filter component');
    }

    const activeFilter = data.activeFilters.find(x => x.field === data.filterField);

    if (activeFilter && activeFilter.filter) {
      const values = activeFilter.filter.split(':');
      const searchTerm = values[0];

      if (data.filterType === 'date') {
        const time = values.slice(1).join(':');
        values.length = 2;
        values[1] = time;
      }

      const searchValue = values[1]

      this.filterValue.set(searchTerm);
      this.formValue.set(searchValue);
      this.hasActiveFilter = true;
    }
  }

  getBaseFilters() {
    switch (this.data.filterType) {
      case 'string':
        return StringFilterTypes;
      case 'int':
        return IntFilterTypes;
      case 'boolean':
        return BooleanFilterTypes;
      case 'date':
        return DateFilterTypes;
      default:
        throw new Error(`Unknown filter type: ${this.data.filterType}`)
    }
  }

  clearFilter() {
    this.dialogRef.close({
      field: this.data.filterField,
      filter: null
    });
  }

  close() {
    const filter = this.filterValue();

    if (! filter) {
      console.log('Error, select a filter');
      return;
    }

    const value = this.formValue();

    if (! value) {
      console.log('Error, create a value');
      return;
    }

    let finalFilter: string|null = null;

    finalFilter = `${filter}:${value}`;

    this.dialogRef.close({
      field: this.data.filterField,
      filter: finalFilter
    });

  }
}
