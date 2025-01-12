import { animate, state, style, transition, trigger } from '@angular/animations';
import { AsyncPipe, JsonPipe, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavAccordionItemDirective } from './nav-accordion-item.directive';
import { NavAccordionToggleDirective } from './nav-accordion-toggle.directive';
import { NavAccordionDirective } from './nav-accordion.directive';
import { MenuService } from '@mn/project-one/client/services/menu';

@Component({
  selector: 'lib-root-sidebar-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    SlicePipe,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatRippleModule,
    NavAccordionDirective,
    NavAccordionItemDirective,
    NavAccordionToggleDirective,
  ],
  animations: [
    trigger('expansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: '' })),
      transition(
        'expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4,0,0.2,1)')
      ),
    ]),
  ],
})
export class SidemenuComponent {
  // The ripple effect makes page flashing on mobile
  @Input() ripple = false;

  private readonly menu = inject(MenuService);

  menu$ = this.menu.getAll();
}
