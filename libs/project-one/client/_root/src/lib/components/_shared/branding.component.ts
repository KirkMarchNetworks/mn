import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-branding',
  template: `
    <a class="branding" [routerLink]="'/'">
      @if (showSmallLogo) {
        <img src="/images/march-logo-sm.png" class="branding-logo" alt="logo" />
      } @else {
        <img src="/images/march-logo-lg.png" class="branding-logo" alt="logo" />
      }
    </a>
  `,
  styles: `
    .branding {
      display: flex;
      align-items: center;
      margin: 0 0.5rem;
      text-decoration: none;
      white-space: nowrap;
      color: inherit;
      border-radius: 50rem;
    }

    .branding-logo {
      height: 32px;
    }
  `,
  standalone: true,
  imports: [
    RouterLink
  ]
})
export class BrandingComponent {
  @Input() showSmallLogo = false;
}
