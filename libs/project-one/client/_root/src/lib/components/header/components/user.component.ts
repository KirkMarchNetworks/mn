import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AuthService } from '@mn/project-one/client/services/auth';
import { ClientRouting } from '@mn/project-one/shared/models';

export interface User {
  [prop: string]: any;

  id?: number | string | null;
  name?: string;
  email?: string;
  avatar?: string;
  roles?: any[];
  permissions?: any[];
}

@Component({
  selector: 'app-user',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>account_circle</mat-icon>
    </button>

    <mat-menu #menu="matMenu">
      <button [routerLink]="settingsRoute" mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule],
})
export class UserComponent {
  private readonly _authService = inject(AuthService);

  settingsRoute = ClientRouting.settings.absolutePath();

  logout() {
    this._authService.initiateLogout();
  }
}
