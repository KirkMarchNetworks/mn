import { TitanEmbeddingTextV1Interface } from './titan-embedding-text-v1.interface';
import { TitanEmbeddingTextV2Interface } from './titan-embedding-text-v2.interface';
import { TitanEmbeddingMultiModelV1Interface } from './titan-embedding-multi-model-v1.interface';

export type TitanEmbeddingType =
  TitanEmbeddingTextV1Interface |
  TitanEmbeddingTextV2Interface |
  TitanEmbeddingMultiModelV1Interface;
