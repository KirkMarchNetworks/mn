import { Route } from '@angular/router';
import { ClientRouting } from '@mn/project-one/shared/models';
import { UsersComponent } from './users.component';

const routes = ClientRouting.userManagement.children.roles;

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: UsersComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Users',
        loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: routes.children.add.path,
        title: `Add User`,
        loadComponent: () => import('./components/add-user/add-user.component').then(m => m.AddUserComponent)
      }
    ]
  }

];
