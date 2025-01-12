import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressSpinner, ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'lib-progress-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinner],
  templateUrl:
    './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.css',
})
export class ProgressSpinnerComponent {
  @Input({ required: true }) spinnerMode: ProgressSpinnerMode|undefined;
  @Input() spinnerValue = 5;
  @Input() textDisplay = 'Loading...';
}
