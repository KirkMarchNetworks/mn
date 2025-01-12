import { Route } from '@angular/router';
import { ClientRouting } from '@mn/project-one/shared/models';
import { TenantManagementComponent } from './tenant-management.component';

const routes = ClientRouting.superAdmin.children.tenantManagement;

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: TenantManagementComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Tenant Management',
        loadComponent: () => import('./components/list/list.component').then(m => m.ListComponent)
      },
      {
        path: routes.children.add.path,
        title: `Add Tenant`,
        loadComponent: () => import('./components/add/add.component').then(m => m.AddComponent)
      }
    ]
  }

];
