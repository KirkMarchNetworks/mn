import { Route } from '@angular/router';
import { ClientRouting } from '@mn/project-one/shared/models';
import { loggedInGuard, loggedOutGuard, superAdminGuard } from '@mn/project-one/client/guards';

export const rootRoutes: Route[] = [
  {
    path: ClientRouting.about.path,
    title: 'About',
    loadComponent: () => import('@mn/project-one/client/features/about').then(m => m.AboutComponent),
  },
  {
    path: ClientRouting.logout.path,
    title: 'Logout',
    loadComponent: () => import('@mn/project-one/client/features/logout').then(m => m.LogoutComponent),
  },
  {
    path: ClientRouting.login.path,
    title: 'Login',
    loadComponent: () => import('@mn/project-one/client/features/login').then(m => m.LoginComponent),
    canActivate: [ loggedOutGuard ]
  },
  {
    path: ClientRouting.forgotPassword.path,
    title: 'Forgot Password',
    loadComponent: () => import('@mn/project-one/client/features/forgot-password').then(m => m.ForgotPasswordComponent),
    canActivate: [ loggedOutGuard ]
  },
  {
    path: ClientRouting.superAdmin.path,
    title: 'Super Admin',
    loadChildren: () => import('@mn/project-one/client/features/super-admin').then(m => m.ROUTES),
    canActivate: [ superAdminGuard ]
  },
  {
    path: ClientRouting.settings.path,
    title: 'Settings',
    loadChildren: () => import('@mn/project-one/client/features/settings').then(m => m.ROUTES),
    canActivate: [ loggedInGuard ]
  },
  {
    path: ClientRouting.main.path,
    title: 'Evidence Vault',
    loadChildren: () => import('@mn/project-one/client/features/main').then(m => m.ROUTES),
    canActivate: [ loggedInGuard ]
  },
  {
    path: ClientRouting.userManagement.path,
    title: 'User Management',
    loadChildren: () => import('@mn/project-one/client/features/user-management').then(m => m.ROUTES),
    canActivate: [ loggedInGuard ]
  },
  {
    path: ClientRouting.intelligentRetrieval.path,
    title: 'Intelligent Retrieval',
    loadChildren: () => import('@mn/project-one/client/features/intelligent-retrieval').then(m => m.ROUTES),
    canActivate: [ loggedInGuard ]
  },


];
