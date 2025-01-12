import { Upload } from '@tus/server';
import { FileUploadedMetadataType } from '@mn/project-one/server/events';

export type TusUploadMetadataType = Upload['metadata'] & FileUploadedMetadataType
