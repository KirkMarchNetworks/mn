import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { map, take, tap } from 'rxjs';
import { AuthService } from '@mn/project-one/client/services/auth';
import { ClientRouting } from '@mn/project-one/shared/models';

export const loggedOutGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoggedOut$.pipe(
    take(1),
    map(isLoggedOut => {
      if (!isLoggedOut) {
        router.navigate([ ClientRouting.main.absolutePath() ]);
      }
      return isLoggedOut;
    })
  )
}
