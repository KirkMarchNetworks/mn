import { Upload } from '@tus/server'

export interface TusOptionsInterface {
  bucketNameToTransferOnComplete: string;
  onCompleteCallback: (upload: Upload) => void;
}
