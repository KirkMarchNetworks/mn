import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { TopmenuPanelComponent } from './topmenu-panel.component';
import { Menu, MenuService } from '@mn/project-one/client/services/menu';
import { MenuItemComponent } from './components/menu-item/menu-item.component';

export interface TopmenuState {
  active: boolean;
  route: string;
}

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrl: './topmenu.component.scss',
  host: {
    class: 'app-topmenu',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    TopmenuPanelComponent,
  ]
})
export class TopmenuComponent implements OnDestroy {
  private readonly menu = inject(MenuService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  menu$ = this.menu.getAll();

  menuList: Menu[] = [];
  menuStates: TopmenuState[] = [];

  private menuSubscription = Subscription.EMPTY;
  private routerSubscription = Subscription.EMPTY;

  constructor() {
    this.menuSubscription = this.menu$.subscribe(res => {
      this.menuList = res;
      this.menuList.forEach(item => {

        this.menuStates.push({
          active: this.router.url.split('/').includes(item.route),
          route: item.route,
        });
      });
    });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(e => {
        this.menuStates.forEach(item => (item.active = false));
      });
  }

  ngOnDestroy() {
    this.menuSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  onRouteChange(rla: RouterLinkActive, index: number) {
    this.routerSubscription.unsubscribe();
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(e => {
        this.menuStates.forEach(item => (item.active = false));
        setTimeout(() => {
          this.menuStates[index].active = rla.isActive;
          this.cdr.markForCheck();
        });
      });
  }
}
