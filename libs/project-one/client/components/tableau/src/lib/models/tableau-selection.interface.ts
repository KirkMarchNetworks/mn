import { SelectionModel } from "@angular/cdk/collections";

export interface TableauSelectionInterface<T> {
  canSelect: boolean;
  multiSelect?: boolean;
  selectionDisplay?: 'checkbox' | 'rowSelect',
  selectionModel?: SelectionModel<T>,
  doubleClick?: (item: T) => void;
}
