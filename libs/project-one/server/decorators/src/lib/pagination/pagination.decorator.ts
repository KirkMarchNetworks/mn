import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import {
  extractSearchFields,
  extractSortFields,
  FindAllParamsInterface,
  PaginationInterface,
  SortSearchInterface,
} from '@mn/project-one/shared/sort-search-page';
import { isInt } from 'class-validator';

const getValues = (target: any, propertyKey: string | symbol | undefined) => {
  if (target === undefined || propertyKey === undefined) {
    throw new Error('');
  }
  const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
  if (!propertyDescriptor) {
    throw new Error('');
  }
  return {
    t: target,
    pk: propertyKey,
    pd: propertyDescriptor,
  };
}

export const Pagination = createParamDecorator<SortSearchInterface<any>>((data, ctx): PaginationInterface => {
    const req: Request = ctx.switchToHttp().getRequest();

    // Defaults
    const paginationParams: PaginationInterface = {
      skip: 0,
      take: 10,
      sort: [],
      search: [],
      sortSearch: data
    };

    const take = req.query['take'];
    if (take) {
      // TODO: Validate that take is a valid number, greater than 0 and less than 100
      // if (isNaN(take) || page < 0 || isNaN(size) || size < 0) {
      //   throw new BadRequestException('Invalid pagination params');
      // }
      paginationParams.take = parseInt(take.toString());
    }

    // // TODO: Validate that skip is a valid number, greater than 0
    if (req.query['skip']) {
      paginationParams.skip = parseInt(req.query['skip'].toString());
    }

    // create array of sort
    if (req.query['sort']) {
      try {
        paginationParams.sort = extractSortFields(req.query['sort'].toString(), data.sort);
      } catch (e) {
        throw new BadRequestException(e)
      }
    }

    // create array of search
    if (req.query['search']) {
      try {
        paginationParams.search = extractSearchFields(req.query['search'].toString(), data.search);
      } catch (e) {
        throw new BadRequestException(e)
      }
    }

    return paginationParams;
  },
  [
    (target, propertyKey) => {
      const { t, pk, pd } = getValues(target, propertyKey);
      // Use `@ApiQuery` decorator purely as a function to define the meta only once here.
      ApiQuery({
        name: 'take',
        schema: { default: 10, type: 'number', minimum: 1 },
        required: false,
      })(t, pk, pd);

      ApiQuery({
        name: 'skip',
        schema: { default: 0, type: 'number', minimum: 0 },
        required: false,
      })(t, pk, pd);

      ApiQuery({
        name: 'sort',
        schema: { type: 'string' },
        required: false,
      })(t, pk, pd);

      ApiQuery({
        name: 'search',
        schema: { type: 'string' },
        required: false,
      })(t, pk, pd);
    }
  ]
);
