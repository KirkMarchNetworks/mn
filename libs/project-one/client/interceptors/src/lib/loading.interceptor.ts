import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CoreUiRepo } from '@mn/project-one/client/repos/core-ui';
import { DisableLoaderKey } from '@mn/project-one/client/models';

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const coreUiRepo = inject(CoreUiRepo);

  if (! req.context.get(DisableLoaderKey)) {
    coreUiRepo.updateLoading(true);
  }

  return next(req)
    .pipe(
      finalize(() => {
        coreUiRepo.updateLoading(false)
      })
    );
}
