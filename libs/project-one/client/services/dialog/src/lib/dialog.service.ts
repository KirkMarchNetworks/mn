import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { ConfirmDialogComponent, ConfirmDialogDataInterface, TagTypeEnum } from '@mn/project-one/client/components/confirm-dialog';
import { LoginComponent, LoginDialogDataInterface } from '@mn/project-one/client/features/login';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {
  }

  deleteConfirmation(msg: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: [
          {
            tagType: TagTypeEnum.Paragraph,
            tagValue: msg
          }
        ]
      } as ConfirmDialogDataInterface
    });
    return dialogRef.afterClosed().pipe(
      map(result => result === true)
    );
  }

  openLoginDialog() {
    return this.openCustom<LoginComponent, LoginDialogDataInterface, boolean>(
      LoginComponent,
      {
        data: { dialog: true }
      },
    )
  }

  dirtyFormConfirmation(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: [
          {
            tagType: TagTypeEnum.Paragraph,
            tagValue: `Are you sure you want to leave this page, all your form data will be lost?`
          }
        ]
      } as ConfirmDialogDataInterface
    });
    return dialogRef.afterClosed().pipe(
      map(result => result === true)
    );
  }

  openCustom<T, D = any, R = any>(component: ComponentType<T>, config?: MatDialogConfig<D>) {
    const dialogRef = this.dialog.open<T, D, R>(component, config);
    return dialogRef.afterClosed();
  }

  customConfirmation(data: ConfirmDialogDataInterface): Observable<boolean> {
    // Unsaved changes, confirm data loss before navigating
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data });
    return dialogRef.afterClosed().pipe(
      map(result => result === true)
    );
  }

  confirm(message: string) {
    return new Promise<boolean>(resolve => {
      return resolve(window.confirm(message));
    });
  }
}
