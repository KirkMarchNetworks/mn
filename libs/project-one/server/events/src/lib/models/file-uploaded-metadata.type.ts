import { BucketNameType } from '@mn/project-one/server/models';

// This needs to be of type Record<string, string | null> to comply with the Tus Upload['metadata'] signature
export type FileUploadedMetadataType = Record<string, string | null> & {
  tenantId: string;
  userId: string;
  path: string;
  originalName: string;
  bucketName: BucketNameType;
  customMetadata: string;
}
