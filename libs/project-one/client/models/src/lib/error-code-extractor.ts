import { HttpErrorResponse } from '@angular/common/http';

export const errorCodeExtractor = (err: any): string|undefined => {
  if (err instanceof HttpErrorResponse) {
    if (err.error?.errorCode) {
      return err.error.errorCode;
    }
  }
  return;
}
