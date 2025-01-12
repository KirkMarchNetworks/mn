import { appConfig } from './models/app-config';
import { bullBoardConfig } from './models/bull-board-config';
import { emailConfig } from './models/email-config';
import { fileConfig } from './models/file-config';
import { firebaseConfig } from './models/firebase-config';
import { redisConfig } from './models/redis-config';
import { simpleStorageConfig } from './models/simple-storage-config';
import { awsBedrockConfig } from './models/aws-bedrock-config';

export const config = [
  appConfig,
  bullBoardConfig,
  emailConfig,
  fileConfig,
  firebaseConfig,
  redisConfig,
  simpleStorageConfig,
  awsBedrockConfig
]
