import {
  ChangeDetectionStrategy,
  Component,
  model,
  OnDestroy, OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { NgIf } from '@angular/common';

@Component({
  selector: 'lib-components-filter-dialog-boolean-filter',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatError,
    MatOption,
    MatSelect,
  ],
  templateUrl: './boolean-filter.component.html',
  styleUrls: [ './boolean-filter.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooleanFilterComponent implements OnInit, OnDestroy {
  formControl = new FormControl('', [ Validators.required ]);
  value = model.required<null | string>();

  private _subscriptions = new Subscription();

  ngOnInit() {
    this.formControl.setValue(this.value());
    this._subscriptions.add(
      this.formControl.valueChanges.subscribe(value => {
        this.value.set(value);
      })
    );
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
