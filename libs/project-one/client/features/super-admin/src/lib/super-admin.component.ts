import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';

@Component({
  selector: 'lib-project-one-client-features-super-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.css',
})
export class SuperAdminComponent {
  leftMenuComponent= MenuComponent;
  leftMenuText = 'Super Admin';
}
