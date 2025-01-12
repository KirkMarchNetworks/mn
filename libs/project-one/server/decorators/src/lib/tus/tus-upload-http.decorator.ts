import { applyDecorators, Post } from '@nestjs/common';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

export function TusUploadHttp(
  path: string
) {
  return applyDecorators(
    Post(path),
    addDescriptionToSwaggerDocumentation()
  );
}

function addDescriptionToSwaggerDocumentation() {
  return (target: object, key: string | symbol, descriptor?: TypedPropertyDescriptor<any>): any => {
    if (descriptor) {
      const apiOperation = Reflect.getMetadata(DECORATORS.API_OPERATION, descriptor.value) || {};
      const description = `${apiOperation.description || ""}<br/><br/>
      The use of this API requires a TUS-CLIENT.`;
      Reflect.defineMetadata(
        DECORATORS.API_OPERATION,
        {
          ...apiOperation,
          description,
        },
        descriptor.value,
      );
    }
    return descriptor;
  };
}
