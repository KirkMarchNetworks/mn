import Ajv, {JTDSchemaType} from "ajv/dist/jtd"

const ajv = new Ajv()

const schema: JTDSchemaType<{ uploadName: string, metadata: string }> = {
  properties: {
    uploadName: { type: 'string' },
    metadata: { type: 'string' }
  },
}

// serialize will only accept data compatible with MultiUploadRequestInterface
export const multiUploadRequestSerialize = ajv.compileSerializer(schema)

// parse will return MultiUploadRequestInterface or undefined
export const multiUploadRequestParse = ajv.compileParser(schema)


/**
 * This
 */
export class MultiUploadRequest<T extends Record<string, string | null>> {
  // This string must be different between any module that uses it
  private _uploadName: string;
  private _metaData: T | undefined;

  constructor({
    uploadName,
    metaData
              }: {
    uploadName: string
    metaData?: T
  }) {
    this._uploadName = uploadName;
    this._metaData = metaData;
  }

  getEventName() {
    return [ 'fileUploaded', this._uploadName ]
  }

  toString() {
    return multiUploadRequestSerialize({
      uploadName: JSON.stringify(this.getEventName()),
      metadata: JSON.stringify(this._metaData)
    })
  }
}
