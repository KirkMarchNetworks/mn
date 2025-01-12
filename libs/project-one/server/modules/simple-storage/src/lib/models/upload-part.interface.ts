export interface UploadPartInterface {
  uploadId: string;
  key: string;
  body: Buffer|string;
  partNumber: number;
  bucket: string;
}
