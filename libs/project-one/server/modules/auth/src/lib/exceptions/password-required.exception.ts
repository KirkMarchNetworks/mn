import { HttpStatus } from '@nestjs/common';
import { BaseExceptionDto } from '@mn/project-one/server/exceptions';
import { ErrorCodes } from '@mn/project-one/shared/models';

export class PasswordRequiredException extends BaseExceptionDto {
  constructor() {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'A Password is required when creating a verified user.',
      errorCode: ErrorCodes.PasswordRequired
    });
  }
}
