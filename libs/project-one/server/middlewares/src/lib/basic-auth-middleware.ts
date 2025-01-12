import {Inject, NestMiddleware} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { bullBoardConfig } from "@mn/project-one/server/configs";
import { ConfigType } from "@nestjs/config";

export class BasicAuthMiddleware implements NestMiddleware {
  private readonly encodedCredentials: string;

  constructor(
    @Inject(bullBoardConfig.KEY) private config: ConfigType<typeof bullBoardConfig>
  ) {
    this.encodedCredentials = Buffer.from(
      this.config.username + ':' + this.config.password,
    ).toString('base64');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const requestCredentials = req.get('authorization')?.split('Basic ')?.[1] ?? null;

    if (!requestCredentials || requestCredentials !== this.encodedCredentials) {
      res.setHeader(
        'WWW-Authenticate',
        'Basic realm="Your realm", charset="UTF-8"',
      );
      res.sendStatus(401);
    } else {
      next();
    }
  }
}
