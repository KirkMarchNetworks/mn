import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatListItem, MatNavList } from '@angular/material/list';
import { UserManagementMenuComponent } from './components/user-management-menu/user-management-menu.component';

@Component({
  selector: 'lib-user-management',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  leftMenuComponent = UserManagementMenuComponent;
  leftMenuText = 'User Management';
}
