import {BaseRouteInterface} from "./base-route.interface";

export const routeCreator = (path: string, absolutePrefix?: () => string): BaseRouteInterface => {

  const absolutePath = () => {
    if (absolutePrefix) {
      return `${absolutePrefix()}/${path}`;
    }
    return `/${path}`;
  }

  const capitalizedPath = path
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

  return {
    path,
    capitalizedPath,
    absolutePath
  }
}
