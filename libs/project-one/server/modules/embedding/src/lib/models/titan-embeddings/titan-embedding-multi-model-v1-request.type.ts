interface TitanEmbeddingMultiModelV1RequestBaseInterface {
  embeddingConfig?: {
    // Specify one of the following lengths for the output embeddings vector. 256 | 384 | 1024 (default)
    outputEmbeddingLength: 256 | 384 | 1024;
  }
}

interface TitanEmbeddingMultiModelV1Request1Interface extends TitanEmbeddingMultiModelV1RequestBaseInterface {
  // Enter text to convert to embeddings.
  inputText: string;
  // Encode the image that you want to convert to embeddings in base64 and enter the string in this field.
  inputImage: string
}

interface TitanEmbeddingMultiModelV1Request2Interface extends TitanEmbeddingMultiModelV1RequestBaseInterface {
  // Enter text to convert to embeddings.
  inputText: string;
  // Encode the image that you want to convert to embeddings in base64 and enter the string in this field.
  inputImage?: string
}

interface TitanEmbeddingMultiModelV1Request3Interface extends TitanEmbeddingMultiModelV1RequestBaseInterface {
  // Enter text to convert to embeddings.
  inputText?: string;
  // Encode the image that you want to convert to embeddings in base64 and enter the string in this field.
  inputImage: string
}

export type TitanEmbeddingMultiModelV1RequestType =
  TitanEmbeddingMultiModelV1Request1Interface |
  TitanEmbeddingMultiModelV1Request2Interface |
  TitanEmbeddingMultiModelV1Request3Interface;
