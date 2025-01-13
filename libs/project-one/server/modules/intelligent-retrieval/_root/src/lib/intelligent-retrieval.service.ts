import {
  Injectable,
  NotImplementedException,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from '@mn/project-one/server/modules/file';
import { Response } from 'express';
import { paginationExtractor } from '@mn/project-one/server/models';
import { ChannelImageWithDistanceEntity } from './entities/channel-image-with-distance.entity';
import { IntelligentRetrievalRepo } from '@mn/project-one/server/repos/intelligent-retrieval';
import { PaginationInterface } from '@mn/project-one/shared/sort-search-page';
import { PaginatedDto } from '@mn/project-one/server/dtos';
import { SearchQueryType } from './decorators/search-query.decorator';
import { SearchQueryWithVectorType } from '@mn/project-one/server/repos/repo-one-extensions';
import { convertFileNameToStoragePath } from '@mn/project-one/server/modules/intelligent-retrieval/shared';

@Injectable()
export class IntelligentRetrievalService {
  constructor(
    private fileService: FileService,
    private repo: IntelligentRetrievalRepo
  ) {}

  async findAllPaginated(
    tenantId: string,
    searchQuery: SearchQueryType,
    pagination: PaginationInterface
  ): Promise<PaginatedDto<ChannelImageWithDistanceEntity>> {
    const params = paginationExtractor(pagination);

    let foundQuery: SearchQueryWithVectorType | null | undefined;

    if (searchQuery) {
      foundQuery = await this.repo.findPreviousQuery(tenantId, searchQuery);
      if (!foundQuery) {
        throw new Error('Cannot find the query.');
      }
    }

    const totalCount = await this.repo.getChannelImageCountForTenant(
      tenantId,
      params
    );

    let results: ChannelImageWithDistanceEntity[] = [];

    const removeOrderByIfDistanceSort = () => {
      for (const x of Object.keys(params.orderBy)) {
        if (x === 'distance') {
          return {
            ...params,
            orderBy: {},
          };
        }
      }
      return params;
    };

    results = await this.repo.getChannelImages(
      tenantId,
      removeOrderByIfDistanceSort()
    );

    if (foundQuery && results.length) {
      let res = await this.repo.getVectorChannelImages(
        foundQuery.vector,
        results.map((x) => x.id)
      );

      let orderByDistance = true;

      for (const [key, value] of Object.entries(params.orderBy)) {
        if (key !== 'distance') {
          orderByDistance = false;
          break;
        } else {
          if (value === 'desc') {
            res = res.reverse();
          }
        }
      }

      const resultsSortedByDistance = [];
      for (const r of res) {
        const found = results.find((x) => x.id === r.id);

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
        'Content-Type': file.contentType,
      });

      return new StreamableFile(file.body);
    }

    throw new NotImplementedException();
  }

  async getImageCount(tenantId: string) {
    return await this.repo.getImageCount(tenantId);
  }
}

