import { computed, Injectable, signal } from '@angular/core';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  private _currentRoute = signal('');
  currentRoute = this._currentRoute.asReadonly();

  constructor(private _router: Router) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this._currentRoute.set(event.url);
      console.log(event.url)
    });
  }

  isCurrentRoute(path: string) {
    return computed(() => {
      return this.currentRoute() === path
    })
  }
}
