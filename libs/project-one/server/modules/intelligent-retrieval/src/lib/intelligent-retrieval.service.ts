import { Injectable, NotImplementedException, StreamableFile } from '@nestjs/common';
import { FileService } from '@mn/project-one/server/modules/file';
import { Request, Response } from 'express';
import { ImageVectorQueueType, InjectImageVectorQueue } from './processors/vector-image.processor';
import { generateId, MultiUploadRequest, paginationExtractor } from '@mn/project-one/server/models';
import { convertFileNameToStoragePath } from './models/convert-file-name-to-storage-path';
import { EmbeddingService, TitanEmbeddingMultiModelV1Interface } from '@mn/project-one/server/modules/embedding';
import { SearchRequestDto } from './dtos/search-request.dto';
import { ChannelImageWithDistanceEntity } from './entities/channel-image-with-distance.entity';
import { ChannelImageEntity } from './entities/channel-image.entity';
import { convertMulterImageToBase64 } from './models/convert-image-to-base64';
import { IntelligentRetrievalRepo } from '@mn/project-one/server/repos/intelligent-retrieval';
import {
  PaginationInterface,
  SortByType
} from '@mn/project-one/shared/sort-search-page';
import { PaginatedDto } from '@mn/project-one/server/dtos';
import { Prisma } from '@prisma/project-one/one';

import { SearchQueryType } from './decorators/search-query.decorator';
import { CreateSearchTextQueryRequestDto } from './dtos/create-search-text-query-request.dto';
import { SearchQueryEntity } from './entities/search-query.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"
import {
  intelligentRetrievalParse,
  intelligentRetrievalSerialize,
  MultiUploadRequestInterface
} from '@mn/project-one/shared/models';
import { MultiUploadRootName } from './models/multi-upload-root-name';
import { SearchQueryWithVectorType } from '@mn/project-one/server/repos/repo-one-extensions';
import { UpdateSettingsRequestDto } from './dtos/update-settings-request.dto';
import { IntelligentRetrievalSettingsEntity } from './entities/intelligent-retrieval-settings.entity';
import { CreateIntelligentRetrievalEventRequestDto } from './modules/event/dtos/create-intelligent-retrieval-event-request.dto';
import { IntelligentRetrievalEventEntity } from './modules/event/entities/intelligent-retrieval-event.entity';

@Injectable()
export class IntelligentRetrievalService {

  constructor(
    private fileService: FileService,
    private embeddingService: EmbeddingService,
    private repo: IntelligentRetrievalRepo,
    @InjectImageVectorQueue() private imageVectorQueue: ImageVectorQueueType
  ) {
  }

  async findAllPaginated(tenantId: string, searchQuery: SearchQueryType, pagination: PaginationInterface): Promise<PaginatedDto<ChannelImageWithDistanceEntity>> {

    const params = paginationExtractor(pagination);

    let foundQuery: SearchQueryWithVectorType | null | undefined;

    if (searchQuery) {
      foundQuery = await this.repo.findPreviousQuery(tenantId, searchQuery);
      if (! foundQuery) {
        throw new Error('Cannot find the query.');
      }
    }

    const totalCount = await this.repo.getChannelImageCountForTenant(tenantId, params);

    let results: ChannelImageWithDistanceEntity[] = [];

    const removeOrderByIfDistanceSort = () => {
      for (const x of Object.keys(params.orderBy)) {
        if (x === 'distance') {
          return {
            ...params,
            orderBy: {}
          }
        }
      }
      return params;
    }

    results = await this.repo.getChannelImages(tenantId, removeOrderByIfDistanceSort());

    if (foundQuery && results.length) {
      let res = await this.repo.getVectorChannelImages(foundQuery.vector, results.map(x => x.id));

      let orderByDistance = true;

      for (const [key, value] of Object.entries(params.orderBy)) {
        if (key !== 'distance') {
          orderByDistance = false;
          break;
        } else {
          if (value === 'desc') {
            res = res.reverse()
          }
        }
      }

      const resultsSortedByDistance = [];
      for (const r of res) {
        const found = results.find(x => x.id === r.id);

        if (found) {
          found.distance = r.distance;
          if (orderByDistance) {
            resultsSortedByDistance.push(found);
          }
        }
      }
      if (orderByDistance) {
        results = resultsSortedByDistance;
      }
    }

    const p = new PaginatedDto<ChannelImageWithDistanceEntity>();
    p.take = params.take;
    p.skip = params.skip;
    p.total = totalCount;
    p.results = results;
    return p;
  }

  async getImage(tenantId: string, fileName: string, res: Response) {
    const imagePath = convertFileNameToStoragePath(tenantId, fileName);

    const file = await this.fileService.getObject(imagePath, 'imageBucket');

    if (file) {
      res.set({
        'Content-Type': file.contentType
      });

      return new StreamableFile(file.body);
    }

    throw new NotImplementedException();
  }

  async upload(
    tenantId: string,
    file: Express.Multer.File
  ): Promise<ChannelImageEntity> {

    const success = await this.fileService.putObjectAndRemoveFile(file, convertFileNameToStoragePath(tenantId, file.filename));

    if (success) {
      const entity = await this.repo.addImage(tenantId, file.filename, file.originalname);

      await this.imageVectorQueue.add(generateId(), {
        ...entity,
        tenantId
      });

      return entity;
    }

    throw new Error('Error uploading');
  }

  multiUpload(tusHeader: string, req: Request, res: Response) {
    const data = intelligentRetrievalParse(tusHeader);

    console.log(data);

    if (!data) {
      throw new Error('Does not contain correct data')
    }

    // TODO: We can validate that the data.channelId exists for current tenant

    return this.fileService.multiUpload(req, res, new MultiUploadRequest({
      uploadName: MultiUploadRootName,
      metaData: {
        ...data
      }
    }));
  }

  async getSearchQueries(tenantId: string): Promise<SearchQueryEntity[]> {
    return await this.repo.getSearchQueries(tenantId);
  }

  async createSearchTextQuery(tenantId: string, { query }: CreateSearchTextQueryRequestDto): Promise<SearchQueryEntity> {
    const lowerCaseQuery = query.toLowerCase();

    const res = await this.embeddingService.getTextEmbedding(lowerCaseQuery);
    // const res = {
    //   embedding: embeddingForTheWordShoe
    // };

    if (res) {
      const queryId = await this.repo.saveSearchQuery({
        tenantId,
        vector: res.embedding,
        lowerCaseQuery,
        originalCaseQuery: query
      });

      const createdQuery = await this.repo.getSearchQuery(queryId);

      if (createdQuery === null) {
        throw new Error('This should not occur');
      }

      return createdQuery;
    }

    throw new Error('Unable to create search query.')
  }

  async textSearch(
    tenantId: string,
    { query, deviceId, channelId, resultsToReturn = 2 }: SearchRequestDto
  ): Promise<ChannelImageWithDistanceEntity[]> {
    console.log(deviceId);
    console.log(channelId);

    const lowerCaseQuery = query.toLowerCase();

    const matchesPreviousQuery = await this.repo.findPreviousQuery(tenantId, lowerCaseQuery);

    if (matchesPreviousQuery) {
      console.log('We have a match');
      return await this.repo.findSimilar(tenantId, matchesPreviousQuery.vector, resultsToReturn);
    }

    const model: TitanEmbeddingMultiModelV1Interface = {
      modelId: 'amazon.titan-embed-image-v1',
      request: {
        inputText: lowerCaseQuery,
        embeddingConfig: {
          outputEmbeddingLength: 256
        }
      }
    };

    // const res = await this.embeddingService.getNativeEmbedding(model);
    const res = {
      embedding: embeddingForTheWordShoe
    };

    if (res) {
      // await this.repo.saveSearchQuery({
      //   tenantId,
      //   vector: res.embedding,
      //   lowerCaseQuery,
      //   originalCaseQuery: query
      // });

      return await this.repo.findSimilar(tenantId, res.embedding, resultsToReturn);
    }

    throw new Error('Unknown error');
  }

  async getImageCount(tenantId: string) {
    return await this.repo.getImageCount(tenantId);
  }

  async getSettings(tenantId: string): Promise<IntelligentRetrievalSettingsEntity> {
    const settings = await this.repo.getSettings(tenantId);

    if (!settings) {
      throw new Error('Settings not found');
    }
    return settings;
  }

  async updateSettings(tenantId: string, dto: UpdateSettingsRequestDto): Promise<IntelligentRetrievalSettingsEntity> {
    const settings = await this.repo.updateSettings(tenantId, dto.generativeModel);

    return settings;
  }

  async createEvent(tenantId: string, dto: CreateIntelligentRetrievalEventRequestDto): Promise<IntelligentRetrievalEventEntity> {
    const foundQuery = await this.repo.findPreviousQueryId(tenantId, dto.searchQueryId);

    if (! foundQuery) {
      throw new Error('Cannot find the query.');
    }

    const { name, similarityScore } = dto;

    return await this.repo.updateEvents(tenantId, foundQuery.id, name, similarityScore);
  }

  async imageSearch(
    tenantId: string,
    file: Express.Multer.File
  ): Promise<ChannelImageWithDistanceEntity[]> {

    const inputImage = await convertMulterImageToBase64(file);

    await this.fileService.removeFileFromSystem(file);

    const model: TitanEmbeddingMultiModelV1Interface = {
      modelId: 'amazon.titan-embed-image-v1',
      request: {
        inputImage,
        embeddingConfig: {
          outputEmbeddingLength: 256
        }
      }
    };

    const res = await this.embeddingService.getNativeEmbedding(model);

    if (res) {
      return await this.repo.findSimilar(tenantId, res.embedding, 2);
    }

    throw new Error('Unknown error');
  }
}

const embeddingForTheWordShoe = [
  0.015197754,
  -0.025268555,
  0.040039062,
  0.037109375,
  -0.014465332,
  0.025634766,
  -0.037841797,
  0.042236328,
  0.030517578,
  -0.013671875,
  -0.028198242,
  0.04248047,
  0.017456055,
  -0.24707031,
  -0.000120162964,
  -0.01586914,
  -0.025756836,
  -0.06347656,
  0.010314941,
  -0.029541016,
  0.011779785,
  0.01184082,
  -0.08886719,
  -0.055664062,
  -0.095703125,
  0.08300781,
  -0.01977539,
  -0.0034179688,
  -0.07470703,
  0.045654297,
  0.09277344,
  -0.032714844,
  0.047607422,
  -0.047607422,
  -0.099121094,
  0.03881836,
  -0.017456055,
  -0.080078125,
  0.034179688,
  -0.016723633,
  0.23730469,
  0.012756348,
  -0.015625,
  0.017944336,
  0.016723633,
  0.023803711,
  0.019042969,
  -0.03149414,
  -0.091308594,
  -0.05859375,
  -0.044189453,
  0.05126953,
  -0.12890625,
  -0.025756836,
  0.04248047,
  0.012512207,
  0.039794922,
  0.042236328,
  0.024291992,
  -0.078125,
  -0.11669922,
  0.05859375,
  0.048828125,
  0.011962891,
  0.026611328,
  -0.100097656,
  -0.048095703,
  -0.01965332,
  -0.0044555664,
  0.021362305,
  -0.049804688,
  -0.09472656,
  0.034423828,
  0.30273438,
  -0.003326416,
  -0.059814453,
  0.026123047,
  -0.056396484,
  -0.0022277832,
  0.039794922,
  -0.13476562,
  -0.0017318726,
  -0.024780273,
  -0.041748047,
  0.11816406,
  0.083984375,
  -0.029785156,
  -0.04663086,
  -0.04663086,
  -0.076171875,
  0.029907227,
  0.01159668,
  0.0074768066,
  0.019042969,
  -0.010986328,
  -0.053710938,
  0.00491333,
  0.027709961,
  -0.041503906,
  -0.0028076172,
  -0.041259766,
  0.024047852,
  0.060302734,
  -0.020874023,
  0.00491333,
  0.053955078,
  0.01159668,
  0.03515625,
  0.009643555,
  -0.020629883,
  0.041992188,
  -0.016601562,
  0.01171875,
  0.11669922,
  0.04248047,
  0.034179688,
  0.010131836,
  -0.0703125,
  0.12988281,
  -0.115722656,
  -0.025146484,
  0.008483887,
  0.06933594,
  0.057373047,
  0.05493164,
  0.00982666,
  0.009765625,
  0.020874023,
  -0.13183594,
  -0.20507812,
  -0.13769531,
  0.0017166138,
  0.044433594,
  0.02722168,
  0.08251953,
  -0.020385742,
  0.003829956,
  0.036376953,
  -0.083984375,
  -0.018676758,
  -0.002822876,
  -0.055419922,
  0.07324219,
  0.11035156,
  -0.06738281,
  0.029663086,
  -0.024902344,
  0.049560547,
  0.04296875,
  -0.040039062,
  -0.01940918,
  -0.068359375,
  -0.017456055,
  0.033691406,
  0.01965332,
  0.019042969,
  -0.012756348,
  -0.05908203,
  -0.01928711,
  -0.047851562,
  0.0023651123,
  -0.056396484,
  -0.050048828,
  -0.029418945,
  0.023925781,
  -0.0012435913,
  0.10644531,
  -0.088378906,
  -0.008728027,
  -0.052490234,
  -0.09033203,
  0.037597656,
  0.05029297,
  -0.051757812,
  0.040527344,
  -0.004272461,
  -0.067871094,
  -0.026123047,
  -0.052734375,
  0.0043029785,
  -0.016723633,
  0.17675781,
  0.064941406,
  0.006713867,
  0.009338379,
  0.037109375,
  -0.020263672,
  0.028686523,
  -0.06689453,
  -0.04638672,
  0.015991211,
  -0.10888672,
  0.021240234,
  -0.020751953,
  0.038085938,
  0.028564453,
  0.08154297,
  0.0027160645,
  -0.075683594,
  0.007385254,
  -0.051513672,
  -0.024169922,
  0.008483887,
  0.010559082,
  0.000667572,
  0.022460938,
  -0.022460938,
  0.044433594,
  0.06738281,
  -0.010498047,
  -0.07763672,
  -0.0024719238,
  0.09423828,
  0.034423828,
  -0.0029907227,
  0.0138549805,
  0.068359375,
  -0.057617188,
  -0.0015640259,
  -0.0023040771,
  -0.07324219,
  -0.080566406,
  -0.08203125,
  0.005340576,
  0.07128906,
  -0.014587402,
  0.16308594,
  -0.055908203,
  -0.023925781,
  0.03515625,
  0.04638672,
  0.07714844,
  0.06982422,
  0.041992188,
  0.044677734,
  0.09375,
  -0.022949219,
  0.044189453,
  -0.018310547,
  -0.013122559,
  0.0126953125,
  -0.045410156,
  -0.020751953,
  -0.0234375,
  -0.03564453,
  -0.0063476562,
  0.034423828,
  -0.025390625,
  0.047607422,
  -0.014953613,
  0.041503906,
  -0.056396484,
  0.033447266,
  0.04272461,
  -0.21191406,
  -0.011047363
];
