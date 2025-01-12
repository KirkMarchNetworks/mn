import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from '@mn/project-one/server/dtos';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto),
    ApiOkResponse({
        schema: {
          title: `PaginatedResponseOf${model.name}`,
          allOf: [
            { $ref: getSchemaPath(PaginatedDto) },
            {
              properties: {
                results: {
                  type: 'array',
                  items: { $ref: getSchemaPath(model) },
                },
              },
            },
          ],
        },
      }),
    );
};
