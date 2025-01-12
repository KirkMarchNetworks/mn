import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TusUploaderComponent } from '@mn/project-one/client/components/tus-uploader';

@Component({
  selector: 'lib-project-one-client-features-account',
  imports: [
    CommonModule,
    TusUploaderComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {}
