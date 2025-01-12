import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SimpleMessage,
  SimpleMessageComponent,
} from '@mn/project-one/client/components/simple-message';
import { ControlsOfType } from '@mn/project-one/client/models';
import { Subscription } from 'rxjs';
import { ForgotPasswordRequestDto } from '@mn/project-one/shared/api-client';
import { AuthService } from '@mn/project-one/client/services/auth';

@Component({
  selector: 'lib-project-one-client-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    SimpleMessageComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  formGroup = inject(NonNullableFormBuilder).group<
    ControlsOfType<ForgotPasswordRequestDto>
  >({
    tenantName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    emailOrUsername: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  message = new SimpleMessage();

  private _service = inject(AuthService);
  private _subscriptions = new Subscription();

  submit() {
    if (this.formGroup.invalid) {
      return;
    }

    this._subscriptions.add(
      this._service.forgotPassword(this.formGroup.getRawValue()).subscribe({
        next: () => {
          this.message.setMessage(
            `If your username and email address is in the system you should receive a link to reset your password soon.`
          );
        },
        error: (err) => {
          this.message.setMessage(err);
        },
      })
    );
  }
}
