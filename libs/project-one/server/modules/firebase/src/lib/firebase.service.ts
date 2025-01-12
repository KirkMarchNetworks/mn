import { Inject, Injectable, Logger } from '@nestjs/common';
import { cert, initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { NotificationRequestInterface } from "@mn/project-one/shared/notification-models";
import { firebaseConfig } from '@mn/project-one/server/configs';
import { ConfigType } from "@nestjs/config";

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(
    @Inject(firebaseConfig.KEY) private config: ConfigType<typeof firebaseConfig>,
  ) {
    try {
      initializeApp({
        // @ts-ignore
        credential: cert(config.serviceAccountPath)
      });
    } catch (e) {
      this.logger.error('Error loading firebase initializeApp');
    }
  }

  /**
   * Sends a push message to all userIds passed
   * Returns all users which it sent a message to
   */
  // @ts-ignore
  async sendMessageToUserIds(userIds: string[], { title, body, action }: NotificationRequestInterface): Promise<string[]> {
    const successfullySentUserIds = new Set<string>();

    try {
      const fcms: any[] = [];
      // const fcms = await this.prismaService.fcmToken.findMany({
      //   where: {
      //     userId: {
      //       in: userIds
      //     }
      //   },
      //   select: {
      //     userId: true,
      //     token: true
      //   }
      // });

      if (fcms.length === 0) {
        return [];
      }

      const message: MulticastMessage = {
        notification: {
          title,
          body
        },
        data: action ?? {},
        tokens: fcms.map(x => x.token)
      };

      if (message.tokens.length > 500) {
        this.logger.error('Over 500 tokens found, we need to finally refactor this method for that case');
        return [];
      }

      const response = await getMessaging().sendEachForMulticast(message);

      const tokensToRemove = [];
      for (const [i, v] of response.responses.entries()) {
        if (v.success) {
          successfullySentUserIds.add(fcms[i].userId);
        } else {
          if (v.error?.code === 'messaging/registration-token-not-registered') {
            // @ts-ignore
            tokensToRemove.push(message.tokens[i]);
          }
        }
      }

      if (tokensToRemove.length) {
        // await this.prismaService.fcmToken.deleteMany({
        //   where: {
        //     token: {
        //       in: tokensToRemove
        //     }
        //   }
        // });
      }

      return Array.from(successfullySentUserIds);

    } catch (e) {
      console.log('Error sending message:', e);
    }
  }
}
