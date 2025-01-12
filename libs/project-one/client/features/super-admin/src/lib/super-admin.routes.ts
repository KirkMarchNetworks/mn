import { Route } from '@angular/router';
import { ClientRouting } from '@mn/project-one/shared/models';
import { SuperAdminComponent } from './super-admin.component';

const routes = ClientRouting.superAdmin;

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: SuperAdminComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: routes.children.tenantManagement.path
      },
      {
        path: routes.children.tenantManagement.path,
        pathMatch: 'full',
        title: 'Tenant Management',
        loadChildren: () => import('./features/tenant-management/tenant-management.routes').then(m => m.ROUTES)
      },
    ]
  },

];
