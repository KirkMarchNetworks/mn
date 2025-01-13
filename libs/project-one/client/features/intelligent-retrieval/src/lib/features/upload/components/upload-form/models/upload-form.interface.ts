export interface UploadFormInterface {
  device: {
    id: string,
    name: string
  },
  channel: {
    id: string,
    name: string
  },
  timestamp?: string
}
