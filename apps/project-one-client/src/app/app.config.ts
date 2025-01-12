import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

// For a good guide on server side rendering see here
// https://www.angulararchitects.io/en/blog/complete-guide-for-server-side-rendering-ssr-in-angular/

// For a good read on new features in Angular 18 see here
// https://medium.com/@amosisaila/whats-new-in-angular-18-f38b8781f032

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
  ],
};
