import { TagInterface } from './tag.interface';

export interface ConfirmDialogDataInterface {
  title?: string;
  confirmText?: string;
  message: TagInterface[];
}
