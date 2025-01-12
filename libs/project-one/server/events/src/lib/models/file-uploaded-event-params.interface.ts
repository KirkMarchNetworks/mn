import type { Upload } from '@tus/utils';
import { FileUploadedMetadataType } from './file-uploaded-metadata.type';

export interface FileUploadedEventParamsInterface {
  upload: Upload,
  metadata: FileUploadedMetadataType
}
