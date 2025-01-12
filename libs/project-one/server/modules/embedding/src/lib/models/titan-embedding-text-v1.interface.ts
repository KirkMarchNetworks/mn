import { TitanEmbeddingInterface } from './titan-embedding.interface';
import { TitanEmbeddingTextV1RequestInterface } from './titan-embeddings/titan-embedding-text-v1-request.interface';
import { TitanEmbeddingTextV1ResponseType } from './titan-embeddings/titan-embedding-text-v1-response.type';

export interface TitanEmbeddingTextV1Interface extends TitanEmbeddingInterface {
  modelId: 'amazon.titan-embed-text-v1',
  request: TitanEmbeddingTextV1RequestInterface,
  response?: TitanEmbeddingTextV1ResponseType
}
