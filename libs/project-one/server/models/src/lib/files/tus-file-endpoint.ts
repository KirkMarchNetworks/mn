import { ServerRouting } from '@mn/project-one/shared/models';

export const tusFileEndpoint = {
  tusAbsolutePath: ServerRouting.file.children.tus.absolutePath(),
  controllerEndpoint: ServerRouting.file.path,
  methodEndpoint: `${ServerRouting.file.children.tus.path}/*`,
}
