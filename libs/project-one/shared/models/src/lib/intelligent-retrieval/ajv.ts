import Ajv, {JTDSchemaType} from "ajv/dist/jtd"
import { MultiUploadRequestInterface } from './multi-upload-request.interface';

const ajv = new Ajv()

const schema: JTDSchemaType<MultiUploadRequestInterface> = {
  properties: {
    channelId: { type: 'string' },
  },
  optionalProperties: {
    timestamp: { type: 'string' },
  }
}

// serialize will only accept data compatible with MultiUploadRequestInterface
export const intelligentRetrievalSerialize = ajv.compileSerializer(schema)

// parse will return MultiUploadRequestInterface or undefined
export const intelligentRetrievalParse = ajv.compileParser(schema)
