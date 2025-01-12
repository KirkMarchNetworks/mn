import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { AuthService } from '@mn/project-one/client/services/auth';

export const superAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isSuperAdmin$.pipe(
    take(1),
    tap(isAdmin => {
      if (!isAdmin) {
        router.navigate([ '/' ])
      }
    })
  )
}
