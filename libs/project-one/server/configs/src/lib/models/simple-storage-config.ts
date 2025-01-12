import { registerAs } from '@nestjs/config';

export const simpleStorageConfig = registerAs('simpleStorage', () => ({
  endpoint: process.env['SIMPLE_STORAGE_ENDPOINT'],
  region: process.env['SIMPLE_STORAGE_REGION'] || '',
  key: process.env['SIMPLE_STORAGE_KEY'] || '',
  secret: process.env['SIMPLE_STORAGE_SECRET'] || '',
  tmpBucket: process.env['SIMPLE_STORAGE_TMP_BUCKET'] || '',
  imageBucket: process.env['SIMPLE_STORAGE_IMAGE_BUCKET'] || '',
}));
