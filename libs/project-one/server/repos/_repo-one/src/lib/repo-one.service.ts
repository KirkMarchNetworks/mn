import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from "@prisma/project-one/one"
import { getExtendedClient } from '@mn/project-one/server/repos/repo-one-extensions';


@Injectable()
export class RepoOneService extends PrismaClient implements OnModuleInit {
  // This is an example of how we can use an extendedClient
  private _extendedClient = getExtendedClient();
  get extendedClient() {
    return this._extendedClient;
  }

  constructor() {
    super({
      log: ['query']
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
