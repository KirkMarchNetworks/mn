import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import type { ControlsOfType } from '@mn/project-one/client/models';
import { LoginRequestDto } from '@mn/project-one/shared/api-client';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthService } from '@mn/project-one/client/services/auth';
import {
  SimpleMessage,
  SimpleMessageComponent,
} from '@mn/project-one/client/components/simple-message';

@Component({
  selector: 'lib-login-tenant-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatButton,
    SimpleMessageComponent,
  ],
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantFormComponent implements AfterViewInit, OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(AuthService);

  formGroup = this.fb.group<
    ControlsOfType<Pick<LoginRequestDto, 'tenantName'>>
  >({
    tenantName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  message = new SimpleMessage();

  private _subscriptions = new Subscription();

  ngAfterViewInit() {}

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  submit() {
    // this.message.reset();

    if (this.formGroup.invalid) {
      return;
    }

    console.log('test');
  }
}
