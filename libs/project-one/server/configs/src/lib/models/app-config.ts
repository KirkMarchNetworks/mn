import { registerAs } from "@nestjs/config";

export const appConfig = registerAs('app', () => ({
  port: process.env['PROJECT_ONE_SERVER_PORT'] || 3333
}));
