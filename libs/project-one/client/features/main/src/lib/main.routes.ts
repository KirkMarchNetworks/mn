import { Route } from '@angular/router';
import { MainComponent } from './main.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: MainComponent
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
