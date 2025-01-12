import { registerAs } from "@nestjs/config";

export const redisConfig = registerAs('redis', () => ({
  host: process.env['CACHE_HOST'],
  port: parseInt(process.env['CACHE_PORT'] || '', 10),
  password: process.env['CACHE_PASSWORD']
}));
