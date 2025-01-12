import { Route } from '@angular/router';
import { IntelligentRetrievalComponent } from './intelligent-retrieval.component';
import { ClientRouting } from '@mn/project-one/shared/models';

const routes = ClientRouting.intelligentRetrieval;

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: IntelligentRetrievalComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: routes.children.search.path
      },
      {
        path: routes.children.search.path,
        pathMatch: 'full',
        title: 'Search',
        loadComponent: () => import('./components/list/list.component').then(m => m.ListComponent)
      },
      {
        path: routes.children.upload.path,
        title: `Upload`,
        loadComponent: () => import('./components/upload/upload.component').then(m => m.UploadComponent)
      },
      {
        path: routes.children.settings.path,
        title: `Settings`,
        loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
      },
    ]
  },

];
