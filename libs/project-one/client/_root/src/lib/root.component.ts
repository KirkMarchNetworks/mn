import { BidiModule } from '@angular/cdk/bidi';
import {
  AfterViewInit,
  Component,
  HostBinding,
  inject,
  OnDestroy,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatSidenav,
  MatSidenavContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { delay, filter, Subscription } from 'rxjs';
import { CustomizerComponent } from './components/customizer/customizer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarNoticeComponent } from './components/sidebar-notice/sidebar-notice.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopmenuComponent } from './components/topmenu/topmenu.component';
import { CoreUiRepo } from '@mn/project-one/client/repos/core-ui';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { CoreRepo } from '@mn/project-one/client/repos/core';

@Component({
  selector: 'lib-app-root',
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    RouterOutlet,
    BidiModule,
    MatSidenavModule,
    HeaderComponent,
    TopmenuComponent,
    SidebarComponent,
    SidebarNoticeComponent,
    CustomizerComponent,
    AsyncPipe,
  ],
})
export class RootComponent implements OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav | undefined;
  @ViewChild('content', { static: true }) content:
    | MatSidenavContent
    | undefined;

  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly coreUiRepo = inject(CoreUiRepo);

  loginInitialized$ = inject(CoreRepo).initialized$.pipe(delay(500));

  title$ = this.coreUiRepo.title$;

  isOver = this.coreUiRepo.isMobileScreen;

  direction$ = this.coreUiRepo.direction$;

  private _navPosition = signal(this.coreUiRepo.getNavPosition());
  navPosition = this._navPosition.asReadonly();

  sideNavOpened = this.coreUiRepo.isSideNavigationOpened;
  sideNavCollapsed = this.coreUiRepo.isNavigationCollapsed;
  isContentWidthFixed = this.coreUiRepo.isContentWidthFixed;

  headerVisible$ = this.coreUiRepo.headerVisible$;
  private _headerPosition = signal(this.coreUiRepo.getHeaderPosition());
  headerPosition = this._headerPosition.asReadonly();

  showUserPanel$ = this.coreUiRepo.showUSerPanel$;

  @HostBinding('class.app-content-width-fix')
  get contentWidthFix() {
    return (
      this.isContentWidthFixed() &&
      this.navPosition() === 'side' &&
      this.sideNavOpened() &&
      !this.isOver()
    );
  }

  @HostBinding('class.app-sidenav-collapsed-fix')
  get collapsedWidthFix() {
    return (
      this.isCollapsedWidthFixed &&
      (this.navPosition() === 'top' || (this.sideNavOpened() && this.isOver()))
    );
  }

  private isCollapsedWidthFixed = false;

  private layoutChangesSubscription = Subscription.EMPTY;

  ngAfterViewInit() {
    this.loginInitialized$.subscribe(() => {
      const selector = this.document.querySelector('#globalLoader');

      if (selector) {
        // TODO: This is not working
        selector.className = 'global-loader-hidden';

        selector.addEventListener('transitionend', () => {
          selector.className = 'global-loader-hidden';
        });

        if (
          !selector.classList.contains('global-loader-hidden') &&
          !selector.classList.contains('global-loader-fade-out')
        ) {
          selector.className += ' global-loader-fade-out';
        }
      }
    });
    // setTimeout(() => {

    // }, 18000)
  }

  constructor() {
    this.coreUiRepo.navPosition$.subscribe((value) => {
      this._navPosition.set(value);
    });

    this.coreUiRepo.headerPosition$.subscribe((value) => {
      this._headerPosition.set(value);
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        if (this.isOver()) {
          this.sidenav?.close();
        }
        this.content?.scrollTo({ top: 0 });
      });
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.coreUiRepo.updateIsContentWidthFixed(false);
    this.coreUiRepo.updateNavigationCollapsed(!this.sideNavCollapsed());
  }

  onSidenavClosedStart() {
    this.coreUiRepo.updateIsContentWidthFixed(false);
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver();
  }
}
