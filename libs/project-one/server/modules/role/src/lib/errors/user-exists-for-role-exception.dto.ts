import { HttpStatus } from '@nestjs/common';
import { BaseExceptionDto } from '@mn/project-one/server/exceptions';
import { ErrorCodes } from '@mn/project-one/shared/models';

export class UserExistsForRoleExceptionDto extends BaseExceptionDto {
  constructor() {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: `Can't delete a role when they're users who are currently assigned to that role`,
      errorCode: ErrorCodes.UserExistsWithRole
    });
  }
}
