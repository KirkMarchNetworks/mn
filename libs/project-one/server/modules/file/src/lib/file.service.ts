import { Inject, Injectable, Logger, UnsupportedMediaTypeException } from '@nestjs/common';
import { createReadStream, createWriteStream } from 'fs';
import { mkdir, readFile, unlink } from 'fs/promises';
import filetype from 'magic-bytes.js';
import 'multer';
import { createDecrypter, encrypt } from './models/encryption';
import { ConfigType } from "@nestjs/config";
import { join, parse } from "path";
import { CreateArchiveReturnInterface } from "./models/create-archive-return.interface";
import { fileConfig } from '@mn/project-one/server/configs';
import { SimpleStorageService } from '@mn/project-one/server/modules/simple-storage';
import archiver = require('archiver');
import { Request, Response } from 'express';
import { TusService } from '@mn/project-one/server/modules/tus';
import {
  BucketNameType,
  generateFileId,
  generateStorageKey,
  MultiUploadRequest
} from '@mn/project-one/server/models';
import { TestRequestDto } from './dtos/test-request.dto';
import { FetchStream, FetchStreamParamsInterface } from './models/fetch-stream';
import { SimpleResponseDto } from '@mn/project-one/server/dtos';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private simpleStorageService: SimpleStorageService,
    private tusService: TusService,
    @Inject(fileConfig.KEY) private config: ConfigType<typeof fileConfig>
  ) {
  }

  multiUpload(req: Request, res: Response, differentiator?: MultiUploadRequest<Record<string, string | null>>) {
    return this.tusService.handleTus(req, res, differentiator);
  }

  async externalUpload(tenantId: string, userId: string, { path }: TestRequestDto) {
    const bucket = this.simpleStorageService.bucketNames['tempBucket'];
    const key = generateStorageKey(tenantId, userId);
    let uploadId: string|undefined;

    let partNumber = 0;
    const uploadPartResults: Awaited<ReturnType<typeof this.simpleStorageService.uploadPart>>[] = [];
    const uploadPartPromises: Promise<number>[] = [];

    const onWrite: FetchStreamParamsInterface['onWrite'] = chunk => {
      if (!uploadId) {
        throw new Error('An Upload I.D is required.')
      }

      partNumber += 1;

      const uploadPartPromise = this.simpleStorageService.uploadPart({
        bucket,
        key,
        uploadId,
        body: Buffer.from(chunk),
        partNumber
      }).then(data => {
        return uploadPartResults.push(data)
      });

      uploadPartPromises.push(uploadPartPromise);
    };

    const stream = new FetchStream({
      src: path,
      onWrite,
      opts: {
        minimumChunkSize: 1024 * 1024 * 5 // 5mb
      }
    });

    const headers = await stream.initiate();

    if (headers.has('content-type')) {
      // We know from the above line that content-type header exists.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const contentType = headers.get('content-type')!;
      uploadId = await this.simpleStorageService.createMultipartUpload(key, contentType, bucket);
    }

    if (!uploadId) {
      throw new Error('An Upload I.D is required.')
    }

    await stream.start();

    await Promise.all(uploadPartPromises);

    await this.simpleStorageService.completeMultipartUpload({
      bucket,
      key,
      uploadId,
      parts: uploadPartResults.map(x => ({
        ETag: x.eTag,
        PartNumber: x.partNumber
      }))
    });

    return { success: true } as SimpleResponseDto;
  }

  // Everytime a file is uploaded this method should be called so that the magic number can be confirmed,
  // Looks like Multer 2.0 may do this but NestJS has yet to migrate to that version
  async confirmMimeType(file: Express.Multer.File) {
    // TODO: Would be nice to do this even before the file uploads to the server
    // TODO: Maybe update end: to the length of the buffer incase it's less than 100
    // TODO: Also should we be adding a try/finally to close the stream?

    const chunks = [];

    for await (const chunk of createReadStream(file.path, { start: 0, end: 100 })) {
      // @ts-ignore
      chunks.push(chunk);
    }
    const finalBuffer = Buffer.concat(chunks);
    const types = filetype(finalBuffer);

    // Sometimes a single file can have multiple types for example an .apng
    // Or a .mov actually shows up as a .mp4
    // TODO: May need to do more file reading stuff
    if (types.length) {
      const finalType = types[0];
      //if (finalType.mime !== file.mimetype) {
      //  await unlink(file.path);
      //  throw new UnsupportedMediaTypeException()
      //}
    } else {
      await unlink(file.path);
      throw new UnsupportedMediaTypeException()
    }
  }

  async getObject(path: string, bucketName: BucketNameType) {
    return await this.simpleStorageService.getObject(path, this.simpleStorageService.bucketNames[bucketName]);
  }

  async moveObject(
    sourceBucketName: BucketNameType,
    sourcePath: string,
    destinationBucketName: BucketNameType,
    destinationPath: string
  ) {
    return await this.simpleStorageService.moveObject(
      this.simpleStorageService.bucketNames[sourceBucketName],
      sourcePath,
      this.simpleStorageService.bucketNames[destinationBucketName],
      destinationPath
    );
  }

  async createArchive(folderPath: string, fileName: string): Promise<CreateArchiveReturnInterface> {
    const baseFilePath = join(join(__dirname, 'temp'), folderPath);
    await mkdir(baseFilePath, { recursive: true });
    const writeStreamPath = join(baseFilePath, fileName);
    const writeStream = createWriteStream(writeStreamPath);

    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    const zipComplete = new Promise<void>((resolve, reject) => {
      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      writeStream.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        resolve();
      });

      // This event is fired when the data source is drained no matter what was the data source.
      // It is not part of this library but rather from the NodeJS Stream API.
      // @see: https://nodejs.org/api/stream.html#stream_event_end
      writeStream.on('end', function() {
        console.log('Data has been drained');
      });

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
          // log warning
        } else {
          // throw error
          throw err;
        }
      });

      // good practice to catch this error explicitly
      archive.on('error', function(err) {
        throw err;
      });
    })

    // pipe archive data to the file
    archive.pipe(writeStream);

    const appendedNames = new Set<string>();
    const append = (...[ arg1, arg2 ]: Parameters<CreateArchiveReturnInterface['append']>) => {
      if (arg2) {
        if (appendedNames.has(arg2.name)) {
          const parsedPath = parse(arg2.name);
          const nameWithoutExtension = parsedPath.name;
          const extension = parsedPath.ext;

          let counter = 1;

          while(appendedNames.has(nameWithoutExtension + counter + extension)) {
            counter++;
          }

          arg2.name = nameWithoutExtension + counter + extension;
        }
        appendedNames.add(arg2.name);
      }
      archive.append(arg1, arg2);
    }

    const finalizeAndComplete = async () => {
      await archive.finalize();
      await zipComplete;
      const archiveStream = createReadStream(writeStreamPath);
      archiveStream.once('close', async () => {
        archiveStream.destroy();
        try {
          await unlink(writeStreamPath);
          this.logger.log(`File removed successfully: ${ writeStreamPath }`);
        }
        catch (e) {
          this.logger.log(`Error removing ${ writeStreamPath }`, e);
        }
      });
      return archiveStream;
    }

    return {
      append,
      finalizeAndComplete
    }
  }

  async getEncryptedObject(path: string) {
    try {
      const obj = await this.simpleStorageService.getObject(path);

      if (obj) {
        const chunks = [];
        for await (const chunk of obj.body.read(16)) {
          // @ts-ignore
          chunks.push(chunk);
        }
        // @ts-ignore
        const decrypter = createDecrypter(this.config.encryptionKey, Buffer.from(chunks));
        return obj.body.pipe(decrypter);
      }
    } catch (e) {
      this.logger.error(`An unknown error occurred ${ e }`);
    }
    return undefined;
  }

  async putEncryptedObject(file: Express.Multer.File, pathAndFilename = '') {

    const data = await readFile(file.path);
    // @ts-ignore
    const fileEncrypted = encrypt(this.config.encryptionKey, data);

    return await this.simpleStorageService.putBufferObject(file, fileEncrypted, pathAndFilename);
  }

  async putObjectAndRemoveFile(file: Express.Multer.File, pathAndFilename = '') {
    const success = await this.simpleStorageService.putObject(file, pathAndFilename);

    await this.removeFileFromSystem(file);

    return success;
  }

  async removeFileFromSystem(file: Express.Multer.File) {
    try {
      await unlink(file.path);
      this.logger.log(`File removed successfully: ${ file.path }`);
    }
    catch (e) {
      this.logger.log(`Error removing ${ file.path }`, e);
    }
  }
}
