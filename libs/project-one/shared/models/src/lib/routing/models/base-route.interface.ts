export interface BaseRouteInterface {
  path: string;
  capitalizedPath: string;
  absolutePath: () => string;
}
