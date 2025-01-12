import { TitanEmbeddingInterface } from './titan-embedding.interface';
import { TitanEmbeddingMultiModelV1RequestType } from './titan-embeddings/titan-embedding-multi-model-v1-request.type';
import { TitanEmbeddingMultiModelV1ResponseType } from './titan-embeddings/titan-embedding-multi-model-v1-response.type';

export interface TitanEmbeddingMultiModelV1Interface extends TitanEmbeddingInterface {
  modelId: 'amazon.titan-embed-image-v1',
  request: TitanEmbeddingMultiModelV1RequestType,
  response?: TitanEmbeddingMultiModelV1ResponseType
}
