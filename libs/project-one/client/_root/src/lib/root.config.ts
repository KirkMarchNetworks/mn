import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { rootRoutes } from './root.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApiModule, Configuration } from '@mn/project-one/shared/api-client';
import { loadingInterceptor, tokenAndUnauthorizedRequestInterceptor } from '@mn/project-one/client/interceptors';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { TitleService } from '@mn/project-one/client/services/title';
import { appInitializerProviders } from '@mn/project-one/client/providers';

export const rootConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(rootRoutes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loadingInterceptor,
        tokenAndUnauthorizedRequestInterceptor
      ])
    ),
    importProvidersFrom(
      ApiModule.forRoot(() => new Configuration({ basePath: '' }))
    ),
    {
      provide: TitleStrategy,
      useClass: TitleService
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        floatLabel: 'always'
      },
    },
    appInitializerProviders
  ]
};
