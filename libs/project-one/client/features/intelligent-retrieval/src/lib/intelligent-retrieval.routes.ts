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
        loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent)
      },
      {
        path: routes.children.upload.path,
        title: `Upload`,
        loadComponent: () => import('./features/upload/upload.component').then(m => m.UploadComponent)
      },
      {
        path: routes.children.events.path,
        title: `Events`,
        loadChildren: () => import('./features/events/events.routes').then(m => m.ROUTES)
      },
      {
        path: routes.children.settings.path,
        title: `Settings`,
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
    ]
  },

];
