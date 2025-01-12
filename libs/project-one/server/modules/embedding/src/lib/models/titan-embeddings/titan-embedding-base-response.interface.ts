export interface TitanEmbeddingBaseResponseInterface {
  // An array that represents the embeddings vector of the input you provided.
  embedding: number[];
  // The number of tokens in the input.
  inputTextTokenCount: number;
}
