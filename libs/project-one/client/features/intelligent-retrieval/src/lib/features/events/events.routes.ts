import { Route } from '@angular/router';
import { ClientRouting } from '@mn/project-one/shared/models';
import { EventsComponent } from './events.component';

const routes = ClientRouting.intelligentRetrieval.children.events;

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: EventsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Events',
        loadComponent: () => import('./components/list/list.component').then(m => m.ListComponent)
      },
      {
        path: routes.children.create.path,
        title: `Create`,
        loadComponent: () => import('./components/create/create.component').then(m => m.CreateComponent)
      },
    ]
  },

];
