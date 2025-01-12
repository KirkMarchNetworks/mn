import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantFormComponent } from './tenant-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@mn/project-one/client/services/auth';
import { of, throwError } from 'rxjs';
import { SimpleMessageComponent } from '@mn/project-one/client/components/simple-message';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: TenantFormComponent;
  let fixture: ComponentFixture<TenantFormComponent>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const authMock = {
      login: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
        TenantFormComponent,
        SimpleMessageComponent,
        RouterLink
      ],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: null },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    authServiceMock = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    fixture = TestBed.createComponent(TenantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.formGroup.get('emailOrUsername')?.value).toBe('');
    expect(component.formGroup.get('password')?.value).toBe('');
    expect(component.formGroup.get('tenantName')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.formGroup;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      emailOrUsername: 'test@example.com',
      password: 'password',
      tenantName: 'tenant'
    });

    expect(form.valid).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(false);
  });

  it('should call AuthService.login on valid form submission', () => {
    const loginData = {
      emailOrUsername: 'test@example.com',
      password: 'password',
      tenantName: 'tenant'
    };
    component.formGroup.patchValue(loginData);
    authServiceMock.login.mockReturnValue(of(true) as any);

    component.submit();

    expect(authServiceMock.login).toHaveBeenCalledWith(loginData, true);
  });

  it('should not call AuthService.login on invalid form submission', () => {
    component.submit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should set error message on login failure', () => {
    const errorMessage = 'Login failed';
    component.formGroup.patchValue({
      emailOrUsername: 'test@example.com',
      password: 'password',
      tenantName: 'tenant'
    });
    authServiceMock.login.mockReturnValue(throwError(() => errorMessage));

    component.submit();

    expect(component.message.message()).toBe(errorMessage);
  });
});
