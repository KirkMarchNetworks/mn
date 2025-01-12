import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnDestroy,
  Optional,
  signal,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, Subscription, tap } from 'rxjs';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import type { ControlsOfType } from '@mn/project-one/client/models';
import { LoginRequestDto } from '@mn/project-one/shared/api-client';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { AuthService } from '@mn/project-one/client/services/auth';
import {
  SimpleMessage,
  SimpleMessageComponent,
} from '@mn/project-one/client/components/simple-message';
import { ClientRouting } from '@mn/project-one/shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginDialogDataInterface } from './models/login-dialog-data.interface';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatIcon,
    MatIconButton,
    MatButton,
    MatSuffix,
    SimpleMessageComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);

  withinDialog = signal(false);

  constructor(
    @Optional() private dialogRef: MatDialogRef<LoginComponent, boolean>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: LoginDialogDataInterface
  ) {
    if (!this.data) {
      this.withinDialog.set(false);
    }
  }

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(AuthService);

  formGroup = this.fb.group<ControlsOfType<LoginRequestDto>>({
    emailOrUsername: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tenantName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  message = new SimpleMessage();

  showPassword = signal(false);

  forgotPasswordRoute = ClientRouting.forgotPassword.absolutePath();
  queryParams = signal<Params | null | undefined>(null);

  private _subscriptions = new Subscription();

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  updatePass() {
    this.formGroup.patchValue({
      emailOrUsername: 'user1',
      password: '1',
      tenantName: 'tenant1',
    });
  }

  ngAfterViewInit() {
    this._subscriptions.add(
      this.formGroup.controls.emailOrUsername.valueChanges
        .pipe(
          debounceTime(500),
          tap((value) => {
            // this.queryParams.set(SharedRouting.forgotPassword.getQueryParams(value));
          })
        )
        .subscribe()
    );

    this.formGroup.controls.tenantName.valueChanges.subscribe({
      next: (value) => {
        console.log(value);
      },
    });

    this.route.queryParamMap.subscribe({
      next: (value) => {
        if (value.has('tenant')) {
          const tenantName = value.get('tenant');

          if (tenantName) {
            this.formGroup.patchValue({ tenantName });
          }
        }
      },
    });
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  submit() {
    // this.message.reset();

    if (this.formGroup.invalid) {
      return;
    }

    this._subscriptions.add(
      // If this login is being displayed within a dialog window
      // this.data will be true (Session may have expired or something else which requires a login)
      // We don't want to force the user to a different page, so we specifically tell the service not to redirect
      this.service.login(this.formGroup.getRawValue(), !this.data).subscribe({
        next: (value) => {
          if (this.data) {
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          this.message.setMessage(err);
        },
      })
    );
  }
}
