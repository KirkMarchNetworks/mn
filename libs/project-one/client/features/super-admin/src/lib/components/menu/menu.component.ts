import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClientRouting } from '@mn/project-one/shared/models';

@Component({
  selector: 'lib-super-admin-menu',
  standalone: true,
  imports: [CommonModule, MatListItem, MatNavList, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  tenantManagementRoute = ClientRouting.superAdmin.children.tenantManagement.absolutePath();
}
