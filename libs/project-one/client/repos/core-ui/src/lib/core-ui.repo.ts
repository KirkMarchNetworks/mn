import { inject, Injectable, signal } from '@angular/core';
import { createStore, propsFactory, select, withProps } from '@ngneat/elf';
import { excludeKeys, persistState } from '@ngneat/elf-persist-state';
import { PreferencesLocalStorageWrapper } from '@mn/project-one/client/models';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { map, mergeMap, shareReplay, take } from 'rxjs';
import { DOCUMENT } from '@angular/common';


export interface CoreUiProps {
  title: string;
  loading: boolean;
  theme: 'light' | 'dark' | 'auto';
  direction: 'ltr' | 'rtl';
  layout: {
    header: {
      visible: boolean,
      position: 'fixed' | 'static' | 'above';
    },
    navigation: {
      position: 'side' | 'top';
      showUserPanel: boolean;
      allowMultipleExpanded: boolean;
    }
  }
}

export const CORE_UI_STORE_NAME = 'coreUiRepoStore';

export const store = createStore(
  { name: CORE_UI_STORE_NAME },
  withProps<CoreUiProps>({
    title: 'Cool',
    loading: false,
    theme: 'light',
    direction: 'ltr',
    layout: {
      header: {
        visible: true,
        position: 'fixed'
      },
      navigation: {
        position: 'side',
        showUserPanel: true,
        allowMultipleExpanded: true
      }
    }
  })
);

const instance = persistState(store, {
  storage: PreferencesLocalStorageWrapper,
  source: () => store.pipe(excludeKeys(['title', 'loading'])),
});


const MOBILE_MEDIAQUERY = 'screen and (max-width: 599px)';
const TABLET_MEDIAQUERY = 'screen and (min-width: 600px) and (max-width: 959px)';
const MONITOR_MEDIAQUERY = 'screen and (min-width: 960px)';

@Injectable({ providedIn: 'root' })
export class CoreUiRepo {

  title$ = store.pipe(select(state => state.title));
  loading$ = store.pipe(select(state => state.loading));
  theme$ = store.pipe(select(state => state.theme));



  getTheme = () => store.getValue().theme;
  getThemeOptions = () => ['light', 'dark', 'auto'] as const;


  getLayout = () => store.getValue().layout;

  direction$ = store.pipe(select(state => state.direction));
  getDirection = () => store.getValue().direction;
  getDirectionOptions = () => ['ltr', 'rtl'] as const;

  headerVisible$ = store.pipe(select(state => state.layout.header.visible));
  headerPosition$ = store.pipe(select(state => state.layout.header.position));
  getHeaderPosition = () => this.getLayout().header.position;

  navPosition$ = store.pipe(select(state => state.layout.navigation.position));
  getNavPosition = () => this.getLayout().navigation.position;
  showUSerPanel$ = store.pipe(select(state => state.layout.navigation.showUserPanel));

  private _isContentWidthFixed = signal(true);
  isContentWidthFixed = this._isContentWidthFixed.asReadonly();

  private _isSideNavigationOpened = signal(true);
  isSideNavigationOpened = this._isSideNavigationOpened.asReadonly();

  private _isNavigationCollapsed = signal(false);
  isNavigationCollapsed = this._isNavigationCollapsed.asReadonly();

  private readonly document = inject(DOCUMENT);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly mediaMatcher = inject(MediaMatcher);

  private _isMobileScreen = signal(true);
  isMobileScreen = this._isMobileScreen.asReadonly();

  private _isTabletScreen = signal(false);
  isTabletScreen = this._isTabletScreen.asReadonly();

  private _isMonitorScreen = signal(false);
  isMonitorScreen = this._isMonitorScreen.asReadonly();

  constructor() {
    // this.breakpointObserver.observe('(max-width: 900px)').subscribe(result => {
    //   this._isTablet.set(result.matches);
    // });

    this.breakpointObserver
      .observe([MOBILE_MEDIAQUERY, TABLET_MEDIAQUERY, MONITOR_MEDIAQUERY])
      .subscribe(state => {
        // SidenavOpened must be reset true when layout changes
        this.updateSideNavigationState(true);

        this._isMobileScreen.set(state.breakpoints[MOBILE_MEDIAQUERY]);
        this._isTabletScreen.set(state.breakpoints[TABLET_MEDIAQUERY]);
        this._isMonitorScreen.set(state.breakpoints[MONITOR_MEDIAQUERY]);

        this.updateNavigationCollapsed(this.isTabletScreen());
        this.updateIsContentWidthFixed(this.isMonitorScreen());
      });

    instance.initialized$.subscribe(() => {
      this.theme$.subscribe(value => {
        if (value === 'auto' && this.mediaMatcher.matchMedia('(prefers-color-scheme)').media !== 'not all') {
          const isSystemDark = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)').matches;
          this._applyThemeUpdate(isSystemDark ? 'dark' : 'light');
        } else {
          this._applyThemeUpdate(value);
        }
      });

      this.direction$.subscribe(value => {
        this._applyDirectionUpdate(value);
      })
    })
  }

  updateIsContentWidthFixed(isFixed: boolean) {
    this._isContentWidthFixed.set(isFixed);
  }

  updateNavigationCollapsed(isCollapsed: boolean) {
    this._isNavigationCollapsed.set(isCollapsed);
  }

  updateSideNavigationState(isOpened: boolean) {
    this._isSideNavigationOpened.set(isOpened);
  }

  updateTheme(theme: CoreUiProps['theme']) {
    store.update((state) => ({
      ...state,
      theme
    }));
  }

  updateDirection(direction: CoreUiProps['direction']) {
    store.update((state) => ({
      ...state,
      direction
    }));
  }

  private _applyDirectionUpdate(direction: CoreUiProps['direction']) {
    const htmlElement = this.document.querySelector('html');

    if (htmlElement) {
      htmlElement.dir = direction;
    }
  }

  private _applyThemeUpdate(theme: CoreUiProps['theme']) {
    const htmlElement = this.document.querySelector('html');

    if (htmlElement) {
      switch (theme) {
        case 'light':
          if (htmlElement.classList.contains('theme-dark')) {
            htmlElement.classList.remove('theme-dark');
          }
          break;
        case 'dark':
          if (!htmlElement.classList.contains('theme-dark')) {
            htmlElement.classList.add('theme-dark');
          }
          break;
      }
    }
  }

  updateTitle(title: CoreUiProps['title']) {
    store.update((state) => ({
      ...state,
      title
    }));
  }

  updateLoading(loading: CoreUiProps['loading']) {
    store.update((state) => ({
      ...state,
      loading
    }));
  }

  updateLayoutHeader(header: CoreUiProps['layout']['header']) {
    store.update((state) => ({
      ...state,
      layout: {
        ...state.layout,
        header
      }
    }));
  }

  updateLayoutNavigation(navigation: CoreUiProps['layout']['navigation']) {
    store.update((state) => ({
      ...state,
      layout: {
        ...state.layout,
        navigation
      }
    }));
  }
}
