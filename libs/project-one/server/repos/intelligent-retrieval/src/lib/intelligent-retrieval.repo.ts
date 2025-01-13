import { Inject, Injectable } from '@nestjs/common';
import { CreateSearchQueryInterface, RepoOneService } from '@mn/project-one/server/repos/repo-one';
import { channelImageSelect, ChannelImageType } from './types/channel-image.type';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { BedrockEmbeddings } from '@langchain/aws';
import { awsBedrockConfig } from '@mn/project-one/server/configs';
import { ConfigType } from '@nestjs/config';
import { AmazonTitanModelEnum } from './titan/amazon-titan-model.enum';
import { GenerativeModelEnum, Prisma } from '@prisma/project-one/one';
import { ChannelImageWithDistanceType } from './types/channel-image-with-distance.type';
import { searchQuerySelect, SearchQueryWithVectorType } from '@mn/project-one/server/repos/repo-one-extensions';
import { intelligentRetrievalSettingsSelect } from './types/intelligent-retrieval-settings.type';
import { intelligentRetrievalEventsSelect } from './types/intelligent-retrieval-events.type';
import {
  IntelligentRetrievalEventWithSearchQueryType
} from './types/intelligent-retrieval-event-with-search-query.type';

@Injectable()
export class IntelligentRetrievalRepo {

  private vectorStore;

  constructor(
    private repoOneService: RepoOneService,
    @Inject(awsBedrockConfig.KEY) private config: ConfigType<typeof awsBedrockConfig>
  ) {
    // https://github.com/langchain-ai/langchainjs/blob/f2b54c934e0d153bd2b5ca3ce66a10b2262edfcf/libs/langchain-community/src/vectorstores/prisma.ts#L109
    this.vectorStore = PrismaVectorStore.withModel<ChannelImageType>(this.repoOneService).create(
      new BedrockEmbeddings({
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey
        },
        model: AmazonTitanModelEnum.TitanMultiModelEmbeddingV1
      }),
      {
        prisma: Prisma,
        tableName: 'ChannelImage',
        vectorColumnName: 'vector',
        columns: {
          id: PrismaVectorStore.IdColumn,
          content: PrismaVectorStore.ContentColumn,
          channelId: true,
          fileName: true,
          originalName: true,
          createdAt: true
        }
      }
    );
  }

  async addImage(channelId: string, fileName: string, originalName: string): Promise<ChannelImageType> {
    return await this.repoOneService.channelImage.create({
      data: {
        channelId,
        fileName,
        originalName
      },
      select: channelImageSelect
    });
  }

  async addVectorToImage(id: string, vector: number[]) {
    await this.repoOneService.extendedClient.channelImage.addVector(id, vector);
  }

  async getSearchQuery(id: string) {
    return await this.repoOneService.searchQuery.findFirst({
      where: {
        id
      },
      select: searchQuerySelect
    })
  }

  async getSearchQueries(tenantId: string) {
    return await this.repoOneService.searchQuery.findMany({
      where: {
        tenantId
      },
      select: searchQuerySelect
    });
  }

  async saveSearchQuery(params: CreateSearchQueryInterface) {
    return await this.repoOneService.extendedClient.searchQuery.createSearchQuery(params);
    // await this.repoOneService.$executeRawUnsafe(`INSERT INTO "SearchQuery" ("tenantId", "lowerCaseQuery", "originalQuery", "vector") VALUES ('${tenantId}', '${lowerCaseQuery}', '${originalQuery}', ARRAY[${vector.join(',')}])`);
  }

  async findPreviousQuery(tenantId: string, id: string) {
    return await this.repoOneService.extendedClient.searchQuery.getFirstSearchQuery(tenantId, id);
  }

  async findPreviousQueryId(tenantId: string, id: string) {
    return await this.repoOneService.searchQuery.findFirst({
      where: {
        tenantId,
        id
      },
      select: {
        id: true
      }
    })
  }

  async findSimilar(tenantId: string, vector: number[], resultsToReturn: number) {
    const documents = await this.vectorStore.similaritySearchVectorWithScore(vector, resultsToReturn);

    const closestMatches: ChannelImageWithDistanceType[] = [];

    // for (const doc of documents) {
    //   const [model, distance] = doc;
    //
    //   closestMatches.push({
    //     ...model.metadata,
    //     distance
    //   });
    // }

    return closestMatches;
  }

  private _addTenantIdToWhereClause(tenantId: string, params: Required<Pick<Prisma.ChannelImageFindManyArgs, 'where'>>) {
    if (params.where.channel?.device) {
      params.where.channel.device['tenantId'] = tenantId;
    } else {
      if (params.where.channel) {
        params.where.channel.device = {
          tenantId
        }
      } else {
        params.where = {
          ...params.where,
          channel: {
            device: {
              tenantId
            }
          }
        };
      }
    }
  }

  async getChannelImageCountForTenant(tenantId: string, params: Required<Pick<Prisma.ChannelImageFindManyArgs, 'where'>>) {
    this._addTenantIdToWhereClause(tenantId, params);

    return await this.repoOneService.channelImage.count({
      where: params.where
    });
  }

  async getChannelImages(tenantId: string, params: Required<Pick<Prisma.ChannelImageFindManyArgs, 'take' | 'skip' | 'where' | 'orderBy'>>): Promise<ChannelImageWithDistanceType[]> {
    this._addTenantIdToWhereClause(tenantId, params);

    const results = await this.repoOneService.channelImage.findMany({
      ...params,
      select: channelImageSelect
    });

    return results.map(x => ({
      ...x,
      distance: null
    }))
  }

  async getVectorChannelImages(vector: number[], ids: string[]) {
    return await this.repoOneService.extendedClient.channelImage.getVectorChannelImages(vector, ids);
  }

  async getImageCount(tenantId: string) {
    return await this.repoOneService.channelImage.count({
      where: {
        channel: {
          device: {
            tenantId
          }
        }
      }
    });
  }

  async getSettings(tenantId: string) {
    return await this.repoOneService.intelligentRetrievalSettings.findFirst({
      where: {
        tenantId
      },
      select: intelligentRetrievalSettingsSelect
    });
  }

  async upsertSettings(tenantId: string, generativeModel: GenerativeModelEnum) {
    return await this.repoOneService.intelligentRetrievalSettings.upsert({
      where: {
        tenantId
      },
      create: {
        tenantId,
        generativeModel
      },
      update: {
        generativeModel
      },
      select: intelligentRetrievalSettingsSelect
    })
  }

  async updateEvents(tenantId: string, searchQueryId: string, name: string, similarityScore: number) {
    return await this.repoOneService.intelligentRetrievalEvents.upsert({
      where: {
        tenantId
      },
      create: {
        tenantId,
        name,
        searchQueryId,
        similarityScore
      },
      update: {
        tenantId,
        name,
        searchQueryId,
        similarityScore
      },
      select: intelligentRetrievalEventsSelect
    });
  }
}
