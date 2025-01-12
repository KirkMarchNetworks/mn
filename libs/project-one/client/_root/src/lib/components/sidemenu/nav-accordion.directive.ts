import { Directive, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NavAccordionItemDirective } from './nav-accordion-item.directive';
import { MenuService } from '@mn/project-one/client/services/menu';
import { CoreUiRepo } from '@mn/project-one/client/repos/core-ui';

@Directive({
  selector: '[navAccordion]',
  exportAs: 'navAccordion',
  standalone: true,
})
export class NavAccordionDirective {
  private readonly router = inject(Router);
  private readonly menu = inject(MenuService);
  private readonly _coreUiRepo = inject(CoreUiRepo);

  private navItems: NavAccordionItemDirective[] = [];

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.checkOpenedItems());

    // Fix opening status for async menu data
    this.menu.change().subscribe(() => {
      setTimeout(() => this.checkOpenedItems());
    });
  }

  addItem(item: NavAccordionItemDirective) {
    this.navItems.push(item);
  }

  removeItem(item: NavAccordionItemDirective) {
    const index = this.navItems.indexOf(item);
    if (index !== -1) {
      this.navItems.splice(index, 1);
    }
  }

  closeOtherItems(openedItem: NavAccordionItemDirective) {
    if (! this._coreUiRepo.getLayout().navigation.allowMultipleExpanded) {
      this.navItems.forEach(item => {
        if (item !== openedItem) {
          item.expanded = false;
        }
      });
    }
  }

  checkOpenedItems() {
    this.navItems.forEach(item => {
      if (item.route && item.route === '/' && this.router.url === '/') {
        item.expanded = true;
        this.closeOtherItems(item);
      } else if (item.route && item.route !== '/' && this.router.url.startsWith(item.route)) {
        item.expanded = true;
        this.closeOtherItems(item);
      }
    });
  }
}
