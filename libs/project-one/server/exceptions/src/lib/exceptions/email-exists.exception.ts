import { HttpStatus } from '@nestjs/common';
import { BaseExceptionDto } from '../base-exception.dto';
import { ErrorCodes } from '@mn/project-one/shared/models';

export class EmailExistsException extends BaseExceptionDto {
  constructor() {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Email already exists for tenant',
      errorCode: ErrorCodes.EmailExistsAlready
    });
  }
}
