import { TitanEmbeddingInterface } from './titan-embedding.interface';
import { TitanEmbeddingTextV2RequestInterface } from './titan-embeddings/titan-embedding-text-v2-request.interface';
import { TitanEmbeddingTextV2ResponseType } from './titan-embeddings/titan-embedding-text-v2-response.type';

export interface TitanEmbeddingTextV2Interface extends TitanEmbeddingInterface {
  modelId: 'amazon.titan-embed-text-v2:0',
  request: TitanEmbeddingTextV2RequestInterface,
  response?: TitanEmbeddingTextV2ResponseType
}
