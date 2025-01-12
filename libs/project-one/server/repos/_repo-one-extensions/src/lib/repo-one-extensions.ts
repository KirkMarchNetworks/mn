import { PrismaClient } from "@prisma/project-one/one";
import { searchQueryExtension } from "./search-query/search-query.extension";
import { channelImageExtension } from "./channel-image/channel-image.extension";

export function getExtendedClient(arg?: ConstructorParameters<typeof PrismaClient>[0]) {
  return new PrismaClient(arg)
    .$extends(searchQueryExtension())
    .$extends(channelImageExtension())
    ;
}
