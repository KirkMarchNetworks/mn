export interface TitanEmbeddingTextV2RequestInterface {
  // Enter text to convert to embeddings.
  inputText: string;
  // Flag indicating whether or not to normalize the output embeddings. Defaults to true.
  normalize?: boolean;
  // The number of dimensions the output embeddings should have. The following values are accepted: 1024 (default), 512, 256.
  dimensions?: 256 | 512 | 1024;
}
