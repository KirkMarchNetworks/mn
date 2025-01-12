import { registerAs } from '@nestjs/config';

export const awsBedrockConfig = registerAs('awsBedrock', () => ({
  region: process.env['AWS_BEDROCK_REGION'] || '',
  accessKeyId: process.env['AWS_BEDROCK_ACCESS_KEY_ID'] || '',
  secretAccessKey: process.env['AWS_BEDROCK_SECRET_ACCESS_KEY'] || '',
}));
