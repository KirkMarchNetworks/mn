export interface TitanEmbeddingMultiModelV1RequestInterface {
  // Enter text to convert to embeddings.
  inputText: string;
  // Encode the image that you want to convert to embeddings in base64 and enter the string in this field.
  inputImage: string
  embeddingConfig?: {
    // Specify one of the following lengths for the output embeddings vector. 256 | 384 | 1024 (default)
    outputEmbeddingLength: 256 | 384 | 1024;
  }
}
