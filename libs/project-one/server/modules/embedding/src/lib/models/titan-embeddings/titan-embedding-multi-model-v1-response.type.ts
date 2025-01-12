import { TitanEmbeddingBaseResponseInterface } from './titan-embedding-base-response.interface';

export type TitanEmbeddingMultiModelV1ResponseType = TitanEmbeddingBaseResponseInterface & {
  // Specifies any errors that occur during generation.
  message: string;
}
