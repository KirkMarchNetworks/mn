import { Component, EventEmitter, Output } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-notification',
  template: `
    <button mat-icon-button>
      <mat-icon matBadge="5" matBadgeColor="warn" aria-hidden="false">notifications</mat-icon>
    </button>
  `,
  styles: `
    :host ::ng-deep .mat-badge-content {
      --mat-badge-background-color: #ef0000;
      --mat-badge-text-color: #fff;
    }
  `,
  standalone: true,
  imports: [MatBadgeModule, MatButtonModule, MatIconModule, MatListModule, MatMenuModule],
})
export class NotificationComponent {
  messages = ['Server Error Reports 1', 'Server Error Reports 2', 'Server Error Reports 3'];
}
