import { Route } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ClientRouting } from '@mn/project-one/shared/models';

const routes = ClientRouting.settings;

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: SettingsComponent,
  },
];
