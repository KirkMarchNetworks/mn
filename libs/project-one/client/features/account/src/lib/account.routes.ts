import { Route } from '@angular/router';
import { AccountComponent } from './account.component';

export const ACCOUNT_ROUTES: Route[] = [
  {
    path: '',
    component: AccountComponent
  },
  // {
  //   path: 'email',
  //   title: `Update Email`,
  //   loadComponent: () => import('./components/change-email/change-email.component').then(m => m.ChangeEmailComponent)
  // },
  // {
  //   path: 'password',
  //   title: `Update Password`,
  //   loadComponent: () => import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent)
  // },
  // {
  //   path: 'profile',
  //   title: `Update Profile`,
  //   loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  // },
];
