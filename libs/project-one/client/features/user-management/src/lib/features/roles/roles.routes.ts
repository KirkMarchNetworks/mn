import { Route } from '@angular/router';
import { ClientRouting } from '@mn/project-one/shared/models';
import { RolesComponent } from './roles.component';

const routes = ClientRouting.userManagement.children.roles;

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: RolesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Roles',
        loadComponent: () => import('./components/role-list/role-list.component').then(m => m.RoleListComponent)
      },
      {
        path: routes.children.add.path,
        title: `Add Role`,
        loadComponent: () => import('./components/add-role/add-role.component').then(m => m.AddRoleComponent)
      }
    ]
  }

];
