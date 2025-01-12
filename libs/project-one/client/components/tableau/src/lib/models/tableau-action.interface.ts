interface TableauActionItemInterface<T> {
  title: (item: T) => string;
  show?: (item: T) => boolean;
  route?: (item: T) => string;
  action?: (item: T) => void;
}

export type TableauActionType<T> = TableauActionItemInterface<T>[];
