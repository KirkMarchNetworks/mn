import { Route } from '@angular/router';
import { ClientRouting } from '@mn/project-one/shared/models';
import { UserManagementComponent } from './user-management.component';

const routes = ClientRouting.userManagement;

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: UserManagementComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: routes.children.users.path
      },
      {
        path: routes.children.users.path,
        title: 'Users',
        loadChildren: () => import('./features/users/users.routes').then(m => m.ROUTES)
      },
      {
        path: ClientRouting.userManagement.children.roles.path,
        title: `Roles`,
        loadChildren: () => import('./features/roles/roles.routes').then(m => m.ROUTES)
      }
    ]
  }

];
