import { PaginationInterface, SortByType } from '@mn/project-one/shared/sort-search-page';

interface PaginationExtractorInterface {
  skip: number;
  take: number;
  orderBy: { [ index: string ]: SortByType },
  where: Record<string, any>;
}

export const paginationExtractor = (pagination: PaginationInterface) => {
  const { skip, take, sort, search, sortSearch } = pagination;

  if (skip === undefined || take === undefined) {
    throw new Error();
  }

  let orderBy: {[ index: string ]: SortByType} = {};

  if (sort?.length) {
    // For now, we only allow one orderBy value
    if (sort.length > 1) {
      throw new Error('Only one sort value');
    }
    for (const s of sort) {
      let foundKey: string|undefined;
      for (const [ key, value ] of Object.entries(sortSearch.sort)) {
        if (value && value.displayName === s.field) {
          foundKey = key;
          break;
        }
      }
      if (!foundKey) {
        throw new Error('Should never hit');
      }
      const whereSplit = foundKey.split('.');

      const setValueToField = (fields: string[], value: object | string) => {
        const reducer = (acc: any, item: any, index: number, arr: string | any[]) => ({ [item]: index + 1 < arr.length ? acc : value });
        return fields.reduceRight(reducer, {});
      };
      orderBy = setValueToField(whereSplit, s.by)
    }
  }

  let where: Record<string, any> = {};

  if (search?.length) {
    for (const s of search) {
      let foundKey: string|undefined;
      for (const [ key, value ] of Object.entries(sortSearch.search)) {
        if (value && value.displayName === s.field) {
          foundKey = key;
          break;
        }
      }
      if (!foundKey) {
        throw new Error('Should never hit');
      }
      const whereSplit = foundKey.split('.');

      const setValueToField = (fields: string[], value: object) => {
        const reducer = (acc: any, item: any, index: number, arr: string | any[]) => ({ [item]: index + 1 < arr.length ? acc : value });
        return fields.reduceRight(reducer, {});
      };
      where = {
        ...where,
        ...setValueToField(whereSplit, {
          [s.term]: s.value
        })
      }
    }
  }

  return {
    skip,
    take,
    where,
    orderBy
  };
}
