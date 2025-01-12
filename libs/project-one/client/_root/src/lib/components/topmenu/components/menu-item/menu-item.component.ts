import { Component, EventEmitter, input, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Menu } from '@mn/project-one/client/services/menu';

@Component({
  selector: 'lib-app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
})
export class MenuItemComponent {
  @Input({ required: true }) item!: Menu;
}
