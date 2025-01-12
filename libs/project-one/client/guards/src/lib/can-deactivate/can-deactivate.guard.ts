import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivateInterface {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivateInterface> = component => {
  return component.canDeactivate ? component.canDeactivate() : true;
}
