import { FileUploadedEventParamsInterface } from './models/file-uploaded-event-params.interface';

const FILE_UPLOADED_EVENT_NAME_PREFIX = 'fileUploaded';

export const getFileUploaderEventName = (value: string) => {
  return [
    FILE_UPLOADED_EVENT_NAME_PREFIX,
    value
  ]
}
export class FileUploadedEvent {

  constructor(
    public params: FileUploadedEventParamsInterface
  ) {
  }
}
