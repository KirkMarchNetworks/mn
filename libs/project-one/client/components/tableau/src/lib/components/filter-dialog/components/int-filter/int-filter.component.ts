import { ChangeDetectionStrategy, Component, model, OnDestroy, OnInit } from '@angular/core';
import '@angular/localize/init';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-components-filter-dialog-int-filter',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatError
  ],
  templateUrl: './int-filter.component.html',
  styleUrls: [ './int-filter.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntFilterComponent implements OnInit, OnDestroy {
  formControl = new FormControl('', [ Validators.required, Validators.pattern("^[0-9]*$") ]);
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
