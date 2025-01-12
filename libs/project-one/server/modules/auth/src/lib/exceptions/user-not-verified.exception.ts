import { HttpStatus } from '@nestjs/common';
import { BaseExceptionDto } from '@mn/project-one/server/exceptions';
import { ErrorCodes } from '@mn/project-one/shared/models';

export class UserNotVerifiedException extends BaseExceptionDto {
  constructor() {
    super({
      statusCode: HttpStatus.FORBIDDEN,
      message: `User must verify their email before logging into the application`,
      errorCode: ErrorCodes.EmailNotVerified
    });
  }
}
