import type { CompletedPart } from "@aws-sdk/client-s3";

export interface CompleteMultipartUploadRequestInterface {
  bucket: string;
  key: string;
  uploadId: string;
  parts: Required<Pick<CompletedPart, 'ETag' | 'PartNumber'>>[];
}
