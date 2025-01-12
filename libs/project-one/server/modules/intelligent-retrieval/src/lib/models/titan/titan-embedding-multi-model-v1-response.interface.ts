import { TitanEmbeddingBaseResponseInterface } from './titan-embedding-base-response.interface';

export interface TitanEmbeddingMultiModelV1ResponseInterface extends TitanEmbeddingBaseResponseInterface {
  // Specifies any errors that occur during generation.
  message: string;
}
