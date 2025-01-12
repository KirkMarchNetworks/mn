import 'multer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { ConfigType } from '@nestjs/config';
import { Readable } from 'stream';
import { simpleStorageConfig } from '@mn/project-one/server/configs';
import { BucketNamesInterface } from '@mn/project-one/server/models';
import { UploadPartInterface } from './models/upload-part.interface';
import { CompleteMultipartUploadRequestInterface } from './models/complete-multipart-upload-request.interface';

@Injectable()
export class SimpleStorageService {
  private readonly logger = new Logger(SimpleStorageService.name);
  private client: S3;

  public bucketNames: BucketNamesInterface = {
    tempBucket: this._simpleStorageConfig.tmpBucket,
    imageBucket: this._simpleStorageConfig.imageBucket
  };

  constructor(
    @Inject(simpleStorageConfig.KEY) private _simpleStorageConfig: ConfigType<typeof simpleStorageConfig>
  ) {
    this.client = new S3({
      forcePathStyle: true, // TODO: Should this be false in prod?
      endpoint: _simpleStorageConfig.endpoint,
      region: 'us-east-1',
      credentials: {
        accessKeyId: _simpleStorageConfig.key,
        secretAccessKey: _simpleStorageConfig.secret,
      }
    });
  }

  async putObject(file: Express.Multer.File, pathAndFilename = '', bucket = this._simpleStorageConfig.tmpBucket) {
    const finalPathAndFilename = pathAndFilename === '' ? file.filename : pathAndFilename;
    try {
      const obj = await this.client.putObject({
        Bucket: bucket,
        Key: finalPathAndFilename,
        Body: createReadStream(file.path),
        ContentType: file.mimetype
      });
      this.logger.log(`Successfully uploaded ${finalPathAndFilename} to simple storage, simple storage ID = ${obj.VersionId}`);
      return true;
    } catch (e) {
      return false;
    }
    // await unlink(file.path);
  }

  async putBufferObject(file: Express.Multer.File, buffer: Buffer, pathAndFilename = '', bucket = this._simpleStorageConfig.tmpBucket) {
    const finalPathAndFilename = pathAndFilename === '' ? file.filename : pathAndFilename;
    await this.client.putObject({
      Bucket: bucket,
      Key: finalPathAndFilename,
      Body: buffer,
      ContentType: file.mimetype
    });
    await unlink(file.path);
  }

  async getObject(path: string, bucket = this._simpleStorageConfig.tmpBucket) {
    try {
      const obj = await this.client.getObject({
        Bucket: bucket,
        Key: path
      });
      return {
        contentType: obj.ContentType,
        body: obj.Body as Readable
      };
    } catch (e) {
      this.logger.error(`Failed to fetch ${path} from simple storage.`);
      return undefined;
    }
  }

  async moveObject(sourceBucket: string, sourcePath: string, destinationBucket: string, destinationPath: string) {
    try {
      const obj = await this.client.copyObject({
        CopySource: `${sourceBucket}/${sourcePath}`,
        Bucket: destinationBucket,
        Key: destinationPath,
        ContentType: 'image/webp',
        MetadataDirective: 'REPLACE'
      });

      if (obj) {
        await this.client.deleteObjects({
          Bucket: sourceBucket,
          Delete: {
            Objects: [
              {
                Key: sourcePath
              },
              {
                Key: `${sourcePath}.info`
              }
            ]
          }
        });
      }

      return obj;
    } catch (e) {
      this.logger.error(`Failed to path:${sourcePath} from bucket: ${sourceBucket} simple storage.`);
      return undefined;
    }
  }

  async createMultipartUpload(key: string, contentType: string, bucket = this._simpleStorageConfig.tmpBucket) {
    const res = await this.client.createMultipartUpload({
      Bucket: bucket,
      Key: key,
      ContentType: contentType
    });

    if (res.UploadId) {
      return res.UploadId;
    }

    throw new Error('Test');
  }

  async uploadPart({ uploadId, key, body, partNumber, bucket }: UploadPartInterface) {
    // Multipart uploads require a minimum size of 5 MB per part, except for the last part
    const res = await this.client.uploadPart({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      Body: body,
      PartNumber: partNumber,
    });

    if (res.ETag) {
      return {
        eTag: res.ETag,
        partNumber: partNumber
      }
    }
    throw new Error("Upload failed");
  }

  async completeMultipartUpload({ bucket, key, uploadId, parts }: CompleteMultipartUploadRequestInterface) {
    return await this.client.completeMultipartUpload({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts
      },
    });
  }

}
