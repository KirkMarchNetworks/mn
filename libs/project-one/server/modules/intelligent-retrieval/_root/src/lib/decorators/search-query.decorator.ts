import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

const getValues = (target: any, propertyKey: string | symbol | undefined) => {
  if (target === undefined || propertyKey === undefined) {
    throw new Error('');
  }
  const propertyDescriptor = Object.getOwnPropertyDescriptor(
    target,
    propertyKey
  );
  if (!propertyDescriptor) {
    throw new Error('');
  }
  return {
    t: target,
    pk: propertyKey,
    pd: propertyDescriptor,
  };
};

export type SearchQueryType = string | null;

export const SearchQuery = createParamDecorator(
  (data, ctx: ExecutionContext): SearchQueryType => {
    const req: Request = ctx.switchToHttp().getRequest();

    const searchQuery = req.query['searchQuery'];

    if (searchQuery) {
      return searchQuery as string;
    }
    return null;
  },
  [
    (target, propertyKey) => {
      const { t, pk, pd } = getValues(target, propertyKey);
      // Use `@ApiQuery` decorator purely as a function to define the meta only once here.
      ApiQuery({
        name: 'searchQuery',
        schema: { type: 'string' },
        required: false,
      })(t, pk, pd);
    },
  ]
);
