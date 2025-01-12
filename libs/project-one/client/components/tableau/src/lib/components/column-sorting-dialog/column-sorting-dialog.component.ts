import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import '@angular/localize/init';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { TableauColumnInterface } from '../../models/tableau-column.interface';
import { TableauInput } from '../../models/tableau-input';
import { MatList, MatListItem, MatListModule, MatListOption, MatSelectionList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'lib-column-sorting-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatSelectionList,
    MatCheckbox,
    MatListOption,
    MatListModule,
    CdkDropList,
    MatListItem,
    MatIcon,
    MatDivider,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    CdkDrag

  ],
  templateUrl: './column-sorting-dialog.component.html',
  styleUrls: [ './column-sorting-dialog.component.scss' ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ColumnSortingDialogComponent {
  title = $localize`Define / Arrange Columns`;
  selectedColumns: TableauColumnInterface<any>[] = [];

  constructor(
    public dialogRef: MatDialogRef<ColumnSortingDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: TableauInput<any>,
  ) {
    this.selectedColumns = this.data.selectedColumns.map(x => x);
  }

  allSelectionChanged(ev: MatCheckboxChange) {
    if (ev.checked) {
      if (this.data.columns.length !== this.selectedColumns.length) {
        const valuesThatDoNotExist = this.data.columns.filter(x => !this.selectedColumns.some(y => y.columnDef === x.columnDef));
        this.selectedColumns.push(...valuesThatDoNotExist);
      }
    } else {
      this.selectedColumns.splice(1);
    }
  }

  allSelected() {
    return this.data.columns.length === this.selectedColumns.length
  }

  isOneSelected() {
    return !this.allSelected() && this.selectedColumns.length > 0;
  }

  isSelected(column: TableauColumnInterface<any>) {
    return this.selectedColumns.some(x => x.columnDef === column.columnDef);
  }

  selectionChanged(value: boolean, column: TableauColumnInterface<any>) {
    if (value) {
      if (!this.selectedColumns.some(x => x.columnDef === column.columnDef)) {
        this.selectedColumns.push(column);
      }
    } else {
      if (this.selectedColumns.some(x => x.columnDef === column.columnDef)) {
        this.selectedColumns = this.selectedColumns.filter(x => x.columnDef !== column.columnDef);
      }
    }

    // TODO: We shouldn't allow no items selected
    //if (this.selectedColumns.length === 0) {
    //  this.selectedColumns.push(...this.data.columns.slice(0, 1));
    //}
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedColumns, event.previousIndex, event.currentIndex);
  }

  close() {
    this.data.selectedColumns = this.selectedColumns;
    this.dialogRef.close(true);
  }
}
