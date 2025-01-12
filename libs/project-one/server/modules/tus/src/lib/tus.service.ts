import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from "@nestjs/config";
import { Server, EVENTS, Upload } from '@tus/server'
import { S3Store } from '@tus/s3-store';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { simpleStorageConfig } from '@mn/project-one/server/configs';
import {
  generateFileId, generateStorageKey,
  JwtParsedTokenInterface,
  MultiUploadRequest, multiUploadRequestParse, tusFileEndpoint
} from '@mn/project-one/server/models';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileUploadedEvent, getFileUploaderEventName } from '@mn/project-one/server/events';
import { TusUploadMetadataType } from './models/tus-upload-metadata.interface';
import { ServerRouting } from '@mn/project-one/shared/models';

@Injectable()
export class TusService {
  private readonly logger = new Logger(TusService.name);
  private readonly CUSTOM_HEADER_KEY_NAME = 'tus-custom-header';

  private tusServer: Server;

  constructor(
    private eventEmitter: EventEmitter2,
    @Inject(simpleStorageConfig.KEY) private _simpleStorageConfig: ConfigType<typeof simpleStorageConfig>
  ) {
    this.tusServer = new Server({
      path: tusFileEndpoint.tusAbsolutePath,
      datastore: new S3Store({
        partSize: 8 * 1024 * 1024, // Each uploaded part will have ~8MiB,
        s3ClientConfig: {
          forcePathStyle: true,
          bucket: this._simpleStorageConfig.tmpBucket,
          endpoint: this._simpleStorageConfig.endpoint,
          region: this._simpleStorageConfig.region,
          credentials: {
            accessKeyId: this._simpleStorageConfig.key,
            secretAccessKey: this._simpleStorageConfig.secret,
          },
        },
      }),
      // See below for Supabase implementation
      // https://github.com/supabase/storage/blob/master/src/http/routes/tus/lifecycle.ts
      // More info https://github.com/supabase/storage/blob/0636edd5114f887112ee44b3c65e935a0f9fc5f1/src/http/routes/tus/index.ts
      // https://www.npmjs.com/package/@tus/server#example-store-files-in-custom-nested-directories
      namingFunction: (req) => {
        const { tenantId, sub }: JwtParsedTokenInterface = (req as any).user;
        return generateStorageKey(tenantId, sub);
        // return `${jwt.tenantId}/${jwt.sub}/${generateFileId()}`;
      },
      generateUrl: (req, {proto, host, path, id}) => {
        id = Buffer.from(id, 'utf-8').toString('base64url')
        return `${proto}://${host}${path}/${id}`
      },
      getFileIdFromRequest: (req, lastPath) => {
        // lastPath is everything after the last `/`
        // If your custom URL is different, this might be undefined
        // and you need to extract the ID yourself
        return Buffer.from(lastPath as string, 'base64url').toString('utf-8')
      },
      onUploadCreate: async (req, res, upload) => {
        const jwt: JwtParsedTokenInterface = (req as any).user;

        let originalName = '';

        if (upload.metadata) {
          originalName = upload.metadata['filename'] || '';
        }

        const resolver = new Promise<string>(resolve => {
          let multiUploadRequest = '';
          // @ts-ignore
          if (req[this.CUSTOM_HEADER_KEY_NAME]) {
            // @ts-ignore
            multiUploadRequest = req[this.CUSTOM_HEADER_KEY_NAME];
          }
          resolve(multiUploadRequest);
        });

        const metadata: TusUploadMetadataType = {
          ...upload.metadata,
          customMetadata: await resolver,
          tenantId: jwt.tenantId,
          userId: jwt.sub,
          path: upload.id,
          bucketName: 'tempBucket',
          originalName,
        };

        return {
          res,
          metadata
        }
      },
      onUploadFinish: async (req, res, upload: Upload) => {
        const metadata = upload.metadata as TusUploadMetadataType;

        if (metadata) {
          const customMetadata = multiUploadRequestParse(metadata.customMetadata);

          if (customMetadata) {
            const eventName = JSON.parse(customMetadata.uploadName);
            metadata.customMetadata = customMetadata.metadata;

            await this.eventEmitter.emitAsync(
              eventName,
              new FileUploadedEvent({
                upload,
                metadata: {
                  ...metadata
                }
              })
            );
          }
        }

        return res;
      },

    })

    this.tusServer.on(EVENTS.POST_FINISH, ev => {
      console.log((ev as any).file);
      // console.log(ev);
    });
  }

  handleTus(req: Request, res: Response, differentiator?: MultiUploadRequest<Record<string, string | null>>) {
    // TODO: This check is really only required on POST
    if (differentiator) {
      // @ts-ignore
      req[this.CUSTOM_HEADER_KEY_NAME] = differentiator.toString();
    }
    return this.tusServer.handle(req, res);
  }
}
