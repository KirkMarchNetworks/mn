import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-tenant-management',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './tenant-management.component.html',
  styleUrl: './tenant-management.component.css'
})
export class TenantManagementComponent {
}
