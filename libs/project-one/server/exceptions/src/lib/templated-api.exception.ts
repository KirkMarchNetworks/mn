import {
  buildPlaceholder,
  buildTemplatedApiExceptionDecorator
} from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { BaseExceptionDto } from './base-exception.dto';
import { CustomResponseInterface } from './models/custom-response.interface';

export const TemplatedApiException = buildTemplatedApiExceptionDecorator<CustomResponseInterface>(
  {
    statusCode: '$status',
    message: '$description',
    errorCode: '$errorCode',
    timestamp: '01.01.1970T15:30:11',
  },
  {
    requiredProperties: ['statusCode', 'message', 'errorCode', 'timestamp'],
    placeholders: {
      errorCode: buildPlaceholder(
        () => BaseExceptionDto,
        (exception) => exception.getClientCode(),
      ),
    },
  },
);
