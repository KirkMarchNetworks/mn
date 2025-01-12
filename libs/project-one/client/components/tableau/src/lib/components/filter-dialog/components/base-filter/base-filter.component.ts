import { ChangeDetectionStrategy, Component, Input, model, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'lib-components-filter-dialog-base-filter',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatSelect,
    MatOption,
    KeyValuePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './base-filter.component.html',
  styleUrls: [ './base-filter.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFilterComponent implements OnInit, OnDestroy {
  @Input({ required: true }) filters!: Record<string, string>;
  value = model.required<string|null>()
  formControl = new FormControl('', [ Validators.required ] )

  private _subscriptions = new Subscription();

  ngOnInit() {
    this.formControl.setValue(this.value());
    this.formControl.valueChanges.subscribe(value => {
      this.value.set(value);
    })
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
