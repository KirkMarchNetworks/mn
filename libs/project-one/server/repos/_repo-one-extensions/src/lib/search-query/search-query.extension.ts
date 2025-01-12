import { Prisma } from "@prisma/project-one/one";
import { generateId } from '@mn/project-one/server/models';
import { getFirstSearchQuery, createSearchQuery } from "@prisma/project-one/one/sql"
import { CreateSearchQueryInterface } from "./models/create-search-query.interface";
import { SearchQueryWithVectorType } from './types/search-query-with-vector.type';

// https://github.com/pgvector/pgvector
export function searchQueryExtension() {
  return Prisma.defineExtension(prisma => {
      return prisma.$extends({
        name: 'searchQueryExtension',
        model: {
          searchQuery: {
            async createSearchQuery({
                                      tenantId,
                                      lowerCaseQuery = '',
                                      originalCaseQuery = '',
                                      fileName = '',
                                      vector
                                    }: CreateSearchQueryInterface) {
              // TODO: Do some validation
              // If lowerCaseQuery & originalQuery is empty then fileName must exist
              // Also if lowerCaseQuery & originalQuery has value then fileName must be empty, etc..

              const id = generateId(8);
              const vectorString = JSON.stringify(vector);
              await prisma.$queryRawTyped(createSearchQuery(id, tenantId,lowerCaseQuery, originalCaseQuery, fileName, vectorString));

              return id;
            },
            async getFirstSearchQuery(tenantId: string, id: string): Promise<SearchQueryWithVectorType|null> {
              const res = await prisma.$queryRawTyped(getFirstSearchQuery(tenantId,id));

              if (res.length) {
                const firstResult = res[0];
                const vectorString = firstResult.vector;
                let vector: number[] = [];
                if (vectorString) {
                  vector = vectorString
                    .slice(1, vectorString.length - 1) // remove the brackets []
                    .split(',')
                    .map((v) => parseFloat(v));
                }
                return {
                  ...firstResult,
                  vector
                }
              }
              return null
            }
          }
        },
      })
    }
  );
}
