import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClientRouting } from '@mn/project-one/shared/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-project-one-client-intelligent-retrieval-events-create',
  imports: [MatIcon, MatTooltip, MatIconAnchor, RouterLink],
  template: `
    <a
      mat-icon-button
      i18n-matTooltip
      i18n-aria-label
      [routerLink]="CreateRoute"
      matTooltip="Create new event"
      aria-label="Create new event"
    >
      <mat-icon>add</mat-icon>
    </a>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddButtonComponent {
  CreateRoute =
    ClientRouting.intelligentRetrieval.children.events.children.create.absolutePath();
}
