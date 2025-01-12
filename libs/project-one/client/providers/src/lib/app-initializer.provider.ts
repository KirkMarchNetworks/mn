import { InitializationService } from '@mn/project-one/client/services/initialization';
import { APP_INITIALIZER } from '@angular/core';

export function InitializationServiceFactory(startupService: InitializationService) {
  return () => startupService.load();
}

export const appInitializerProviders = [
  {
    provide: APP_INITIALIZER,
    useFactory: InitializationServiceFactory,
    deps: [InitializationService],
    multi: true,
  },
];
