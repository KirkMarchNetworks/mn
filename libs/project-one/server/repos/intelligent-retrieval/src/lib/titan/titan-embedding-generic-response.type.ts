import { TitanEmbeddingTextV1ResponseType } from './titan-embedding-text-v1-response.type';
import { TitanEmbeddingTextV2ResponseType } from './titan-embedding-text-v2-response.interface';
import { TitanEmbeddingMultiModelV1ResponseInterface } from './titan-embedding-multi-model-v1-response.interface';

export type TitanEmbeddingGenericResponseType =
  TitanEmbeddingTextV1ResponseType |
  TitanEmbeddingTextV2ResponseType |
  TitanEmbeddingMultiModelV1ResponseInterface;
