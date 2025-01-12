import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ConfirmDialogDataInterface } from './models/confirm-dialog-data.interface';
import { TagInterface } from './models/tag.interface';
import { TagTypeEnum } from './models/tag-type.enum';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'lib-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButton,
    A11yModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  title = 'test';
  confirmText = 'Yes';
  tags: TagInterface[] = [];
  tagTypes = TagTypeEnum;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogDataInterface) {
    if (data.title) {
      this.title = data.title;
    }
    if (data.confirmText) {
      this.confirmText = data.confirmText;
    }

    this.tags = data.message;
  }
}
