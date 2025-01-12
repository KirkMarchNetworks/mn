import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, mergeMap, takeUntil } from 'rxjs/operators';
import { filter, Subject, take, throwError } from 'rxjs';
import { CoreRepo } from '@mn/project-one/client/repos/core';
import { LoggingInKeyContext } from '@mn/project-one/client/services/auth';
import { DialogService } from '@mn/project-one/client/services/dialog';
import { AuthService } from '@mn/project-one/client/services/auth';


export const tokenAndUnauthorizedRequestInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const cancelWaitingRequestsSubject = new Subject<null>();
  const coreRepository = inject(CoreRepo);
  const dialogService = inject(DialogService);
  const authService = inject(AuthService);

  const _waitForTokenRefreshToFinish = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return coreRepository.tokenRefreshing$.pipe(
      takeUntil(cancelWaitingRequestsSubject),
      filter(tokenRefreshing => !tokenRefreshing),
      take(1),
      mergeMap(() => {
        return _getTokenAndSendRequest(req, next)
      })
    )
  }

  const _getTokenAndSendRequest = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return coreRepository.token$.pipe(
      take(1),
      mergeMap(token => {
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        return next(req);
      })
    )
  }

  // We only want to intercept requests to our API route
  if (req.url.startsWith('/api')) {
    if (req.context.get(LoggingInKeyContext)) {
      return next(req);
    }
    return coreRepository.tokenRefreshing$.pipe(
      take(1),
      mergeMap(tokenRefreshing => {
        if (tokenRefreshing) {
          return _waitForTokenRefreshToFinish(req, next)
        }
        return _getTokenAndSendRequest(req, next).pipe(
          catchError(err => {
            // Check error type
            if (err instanceof HttpErrorResponse) {
              // If it's a 401 error
              if (err.status === HttpStatusCode.Unauthorized) {
                // Let's check if we are already trying a token refresh
                return coreRepository.tokenRefreshing$.pipe(
                  take(1),
                  mergeMap(tokenRefreshing => {
                    // If we are already refreshing the token
                    if (tokenRefreshing) {
                      // Wait for the token refresh to complete before sending the request
                      return _waitForTokenRefreshToFinish(req, next)
                    }
                    // If we aren't already refreshing, let's update it to refreshing
                    coreRepository.updateTokenRefreshing(true);
                    // Open the login dialog so that user can try to re-login
                    return dialogService.openLoginDialog().pipe(
                      mergeMap(success => {
                        // The login dialog will return true if successful and false for every other case
                        if (success) {
                          // Let's re-update the refresh token so that all waiting request can continue
                          coreRepository.updateTokenRefreshing(false);
                          return _getTokenAndSendRequest(req, next);
                        }
                        // Let's cancel all requests waiting in the cue as re-login was unsuccessful
                        cancelWaitingRequestsSubject.next(null);
                        // Let's re-update the refresh token so that all new requests moving forward can function correctly
                        coreRepository.updateTokenRefreshing(false);
                        // Logout the user
                        authService.initiateLogout();
                        return throwError(() => err);
                      })
                    );
                  })
                );
              }
            }
            return throwError(() => err);
          })
        );
      })
    );
  }
  return next(req);
}
