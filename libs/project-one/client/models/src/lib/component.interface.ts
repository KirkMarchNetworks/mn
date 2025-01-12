export interface ComponentInterface<T> {
  new (...args: never[]): T;
}
