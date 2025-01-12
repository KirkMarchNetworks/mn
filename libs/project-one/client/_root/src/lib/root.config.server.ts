import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { rootConfig } from './root.config';
import { provideServerRoutesConfig } from '@angular/ssr';
import { serverRoutes } from './root.routes.server';

const config: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
  ],
};

export const serverConfig = mergeApplicationConfig(rootConfig, config);
