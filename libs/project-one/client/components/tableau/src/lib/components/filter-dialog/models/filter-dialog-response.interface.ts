export interface FilterDialogResponseInterface {
  field: string;
  // Null means clear previous filter
  filter: string|null;
}
