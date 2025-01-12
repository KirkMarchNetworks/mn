import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClientRouting } from '@mn/project-one/shared/models';

@Component({
  selector: 'lib-user-management-menu',
  standalone: true,
  imports: [CommonModule, MatListItem, MatNavList, RouterLink, RouterLinkActive],
  templateUrl: './user-management-menu.component.html',
  styleUrl: './user-management-menu.component.css',
})
export class UserManagementMenuComponent {
  usersRoute = ClientRouting.userManagement.children.users.absolutePath();
  rolesRoute = ClientRouting.userManagement.children.roles.absolutePath();
}
