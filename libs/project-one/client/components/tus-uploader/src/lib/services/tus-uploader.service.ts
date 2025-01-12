import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Uppy } from '@uppy/core';

@Injectable({
  providedIn: 'root'
})
export class TusUploaderService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  // For better typing see
  // https://uppy.io/blog/uppy-4.0/
  loadUppy(callback: { (uppy: typeof Uppy): void; (arg0: typeof Uppy): void; }) {
    // TODO: Should we be using afterNextRender(() => {}) here?
    if (isPlatformBrowser(this.platformId)) {
      import('@uppy/core').then((uppy: typeof import('@uppy/core/lib/index')) => {
        callback(uppy.Uppy);
      });
    }
  }
}
