import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerComponent } from '@mn/project-one/client/components/progress-spinner';

@Component({
  selector: 'lib-project-one-client-features-about',
  imports: [CommonModule, ProgressSpinnerComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
