import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtParsedTokenInterface } from '@mn/project-one/server/models';

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userToken: JwtParsedTokenInterface = request.user;
    return userToken.tenantId;
  },
);
