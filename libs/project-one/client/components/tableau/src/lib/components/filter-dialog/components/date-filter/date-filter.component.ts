import {
  ChangeDetectionStrategy,
  Component,
  model,
  OnDestroy,
  OnInit,
} from '@angular/core';
import '@angular/localize/init';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MtxCalendarView,
  MtxDatetimepicker,
  MtxDatetimepickerActions,
  MtxDatetimepickerApply,
  MtxDatetimepickerCancel,
  MtxDatetimepickerClear,
  MtxDatetimepickerInput,
  MtxDatetimepickerMode,
  MtxDatetimepickerToggle,
  MtxDatetimepickerType,
} from '@ng-matero/extensions/datetimepicker';

type DatePickerInputType = 'input' | 'change';

@Component({
  selector: 'lib-components-filter-dialog-date-filter',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButton,
    MtxDatetimepicker,
    MtxDatetimepickerActions,
    MtxDatetimepickerApply,
    MtxDatetimepickerCancel,
    MtxDatetimepickerClear,
    MtxDatetimepickerInput,
    MtxDatetimepickerToggle,
  ],
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFilterComponent implements OnInit, OnDestroy {
  formControl = new FormControl('', [Validators.required]);
  value = model.required<null | string>();

  type: MtxDatetimepickerType = 'datetime';
  mode: MtxDatetimepickerMode = 'auto';
  startView: MtxCalendarView = 'month';
  multiYearSelector = false;
  touchUi = false;
  twelveHour = false;
  timeInterval = 1;
  timeInput = true;

  private _subscriptions = new Subscription();

  ngOnInit() {
    console.log(this.value());
    this.formControl.setValue(this.value());
    this._subscriptions.add(
      this.formControl.valueChanges.subscribe((value) => {
        if (value) {
          this.value.set((value as unknown as Date).toISOString());
        }
      })
    );
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
