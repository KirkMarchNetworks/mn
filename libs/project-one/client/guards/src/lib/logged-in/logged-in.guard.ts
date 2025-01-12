import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { take, tap } from 'rxjs';
import { AuthService } from '@mn/project-one/client/services/auth';
import { ClientRouting } from '@mn/project-one/shared/models';

export const loggedInGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoggedIn$.pipe(
    take(1),
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        // TODO: Update to query param via ClientRouting.login.method for refresh fixes too
        authService.redirectUrl = state.url;
        router.navigate([ ClientRouting.login.absolutePath() ])
      }
    })
  )
}
