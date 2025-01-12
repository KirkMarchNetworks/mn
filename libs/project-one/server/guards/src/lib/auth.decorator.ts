import { applyDecorators, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

export function Auth() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiException(() => UnauthorizedException, {
      description: 'Unauthorized, invalid session.'
    }),
    UseGuards(JwtAuthGuard),
  );
}
