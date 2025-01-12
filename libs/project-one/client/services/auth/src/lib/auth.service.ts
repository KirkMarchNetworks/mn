import { inject, Injectable } from '@angular/core';
import { auditTime, catchError, delay, from, map, mergeMap, of, shareReplay, Subject, tap, timeout } from 'rxjs';
import { emitOnce, getRegistry } from '@ngneat/elf';
import { HttpContext } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  AuthApiService,
  AuthResponseDto,
  ForgotPasswordRequestDto,
  LoginRequestDto
} from '@mn/project-one/shared/api-client';
import { errorCodeExtractor } from '@mn/project-one/client/models';
import { ClientRouting, ErrorCodes, SuperAdminRoleId } from '@mn/project-one/shared/models';
import { LoggingInKeyContext } from './models/logging-in-key.context';
import { CoreRepo } from '@mn/project-one/client/repos/core';
import { CORE_UI_STORE_NAME } from '@mn/project-one/client/repos/core-ui';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _coreRepo = inject(CoreRepo);

  isLoggedIn$ = this._coreRepo.user$.pipe(
    map(user => user !== null),
    shareReplay(1)
  );

  isLoggedOut$ = this.isLoggedIn$.pipe(
    map(isLoggedIn => !isLoggedIn),
  )

  isSuperAdmin$ = this._coreRepo.user$.pipe(
    map(user => user?.role?.id === SuperAdminRoleId)
  )

  private router = inject(Router);
  private service = inject(AuthApiService);

  redirectUrl = ClientRouting.main.absolutePath();

  // The navigation service needs to know when the routing is complete after
  // a login or logout, so this subject and observable is for them.
  private _loginLogoutRoutedSubject = new Subject<boolean>();
  loginLogoutRouted$ = this._loginLogoutRoutedSubject.asObservable();

  login(loginDto: LoginRequestDto, redirectOnSuccess = true) {
    return this.service.authControllerLogin(loginDto, undefined, undefined, { context: new HttpContext().set(LoggingInKeyContext, true )}).pipe(
      tap(auth => {
        this._updateAuthState(auth);

        if (redirectOnSuccess) {
          this.router.navigateByUrl(this.redirectUrl).then(() => {
            this._loginLogoutRoutedSubject.next(true);
            console.log('FINISHED NAVIGATING');
            // this.eventService.emit({ key: 'login' });
          })
        }
      }),
      catchError(err => {
        const errorCode = errorCodeExtractor(err);

        if (errorCode) {
          if (errorCode === ErrorCodes.EmailNotVerified) {
            throw 'Email not verified';
          }
        }
        throw 'Unknown error';
      })
    );
  }

  forgotPassword(dto: ForgotPasswordRequestDto) {
    return this.service.authControllerForgotPassword(dto);
  }

  initiateLogout() {
    // We don't want to just log the user out instantly, we first trigger the leaving of a page
    // So that warnings of unsaved work can appear before actually logging out
    // This allows a user to save their work if need be before we log out
    this.router.navigateByUrl(ClientRouting.logout.absolutePath());
  }

  finishLogout(skipServer = false) {
    // TODO: Instead of just simulating logout. Actually try initiating a server logout after ":"
    const serverCall = skipServer ? of(null) : of(null).pipe(delay(2400));

    // We subscribe inside this function instead of the component as we need routing to complete
    // When subscribing inside a component you usually supply a takeUntilDestroyed which would end up cancelling this request
    serverCall.pipe(
      // Since a logout can happen instantaneously as soon as landing on the logout page (skipServer = true)
      // Wait at least until next tick to prevent a "ExpressionChangedAfterItHasBeenCheckedError" in RootComponent
      auditTime(0),
      tap(() => {
        getRegistry().forEach(store => {
          if (store.name !== CORE_UI_STORE_NAME) {
            store.reset()
          }
        })
      }),
      auditTime(0),
      mergeMap(() => from(this.router.navigateByUrl(ClientRouting.login.absolutePath())).pipe(
        tap(() => {
          this._loginLogoutRoutedSubject.next(true);
        })
      ))
    ).subscribe();
  }

  private _updateAuthState(auth: AuthResponseDto, triggerBroadcast = true) {
    this._coreRepo.updateAuth(auth);

    if (triggerBroadcast) {
      // const broadcast: AuthUpdatedBroadcastInterface = {
      //   key: 'auth.updated',
      //   payload: auth
      // }
      // this.broadcastService.publish(broadcast)
    }
  }
}
