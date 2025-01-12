import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtParsedTokenInterface } from '@mn/project-one/server/models';

export const UserId = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userToken: JwtParsedTokenInterface = request.user;
    return userToken.sub;
  },
);
