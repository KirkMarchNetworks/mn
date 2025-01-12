import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrandingComponent } from '../_shared/branding.component';
import { NotificationComponent } from './components/notification.component';
import { UserComponent } from './components/user.component';
// import screenfull from 'screenfull';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    class: 'app-header',
  },
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    BrandingComponent,
    NotificationComponent,
    UserComponent,
  ],
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() showBranding = false;
  @Input() showBrandingSmall = false;
  @Input() title: string | null = '';

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();

  toggleFullscreen() {
    console.log('Go Full Screen');
    // import screenfull from 'screenfull';
    // if (screenfull.isEnabled) {
    //   screenfull.toggle();
    // }
  }
}
