import { Injectable } from '@angular/core';
import { BehaviorSubject, share } from 'rxjs';

export interface MenuTag {
  color: string; // background color
  value: string;
}

export interface MenuPermissions {
  only?: string | string[];
  except?: string | string[];
}

export interface MenuChildrenItem {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  children?: MenuChildrenItem[];
  permissions?: MenuPermissions;
}

export interface Menu {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  icon: string;
  label?: MenuTag;
  badge?: MenuTag;
  children?: MenuChildrenItem[];
  permissions?: MenuPermissions;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly menu$ = new BehaviorSubject<Menu[]>([]);

  /** Get all the menu data. */
  getAll() {
    return this.menu$.asObservable();
  }

  /** Observe the change of menu data. */
  change() {
    return this.menu$.pipe(share());
  }

  /** Initialize the menu data. */
  set(menu: Menu[]) {
    this.menu$.next(menu);
    return this.menu$.asObservable();
  }

  /** Add one item to the menu data. */
  prepend(menu: Menu) {
    const tmpMenu = this.menu$.value;
    tmpMenu.unshift(menu);
    this.menu$.next(tmpMenu);
  }

  /** Add one item to the menu data. */
  append(menu: Menu) {
    const tmpMenu = this.menu$.value;
    tmpMenu.push(menu);
    this.menu$.next(tmpMenu);
  }

  /** Reset the menu data. */
  reset() {
    this.menu$.next([]);
  }
}
