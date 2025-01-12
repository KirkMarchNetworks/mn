import { Prisma } from "@prisma/project-one/one";
import { addVectorToChannelImage, getVectorChannelImages } from "@prisma/project-one/one/sql"


export function channelImageExtension() {
  return Prisma.defineExtension(prisma => {
      return prisma.$extends({
        name: 'channelImageExtension',
        model: {
          channelImage: {
            async addVector(id: string, vector: number[]) {
              const vectorStringified = JSON.stringify(vector);
              const res = await prisma.$queryRawTyped(addVectorToChannelImage(id,vectorStringified));

              return res;
            },
            async getVectorChannelImages(vector: number[], ids: string[]) {
              const vectorString = JSON.stringify(vector);
              const idsString = ids.join();
              return await prisma.$queryRawTyped(getVectorChannelImages(vectorString, idsString));
            }
          },
        },
      })
    }
  );
}
