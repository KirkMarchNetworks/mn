import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { adminUser } from '../models/admin-user';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="app-user-panel">
      <img
        class="app-user-panel-avatar"
        src="/images/avatar-default.jpg"
        alt="avatar"
        width="64"
      />
      <div class="app-user-panel-info">
        <h4>{{ user.name }}</h4>
        <h5>{{ user.email }}</h5>
      </div>
    </div>
  `,
  styleUrl: './user-panel.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class UserPanelComponent {
  user = adminUser;
}
