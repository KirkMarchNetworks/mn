import { readFile } from 'fs/promises';
import { Readable } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

const readableStreamToBuffer = (readableStream: Readable) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on('data', (data) => {
      if (data instanceof Buffer) {
        chunks.push(data);
      }
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
};

const bufferImageToBase64 = async (buffer: Buffer) => {
  const image = await sharp(buffer)
    .resize(512, 512, { fit: 'inside' })
    .toBuffer();

  return image.toString('base64');
};

export const convertMulterImageToBase64 = async (file: Express.Multer.File) => {
  const buffer = await readFile(file.path);

  return await bufferImageToBase64(buffer);
};

export const convertImageStreamToBase64 = async (
  readableStream: Readable
): Promise<string> => {
  const buffer = await readableStreamToBuffer(readableStream);

  return await bufferImageToBase64(buffer);
};
