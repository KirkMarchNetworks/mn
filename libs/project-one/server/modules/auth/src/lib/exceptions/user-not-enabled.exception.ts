import { HttpStatus } from '@nestjs/common';
import { BaseExceptionDto } from '@mn/project-one/server/exceptions';
import { ErrorCodes } from '@mn/project-one/shared/models';

export class UserNotEnabledException extends BaseExceptionDto {
  constructor() {
    super({
      statusCode: HttpStatus.FORBIDDEN,
      message: `User is not enabled.`,
      errorCode: ErrorCodes.UserNotEnabled
    });
  }
}
