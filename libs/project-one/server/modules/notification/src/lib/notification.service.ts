import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { WebSocketService } from '../web-socket/web-socket.service';
import { NotificationRequestInterface } from "@mn/project-one/shared/notification-models";
import { NotificationSendToInterface } from "./models/notification-send-to.interface";
import { NotificationProtocolType } from "./models/notification-protocol.type";
import { Role } from "@prisma/project-one/one";

type SendToMap = Map<string, Set<NotificationProtocolType>>;

@Injectable()
export class NotificationService {
  constructor(
    private firebaseService: FirebaseService,
    private webSocketService: WebSocketService,
  ) {}


  private _removeDuplicates(sendTos: NotificationSendToInterface[]): SendToMap {
    // Remove all duplicate SendTos and duplicate protocols in case they exist
    const all = new Map<string, Set<NotificationProtocolType>>();
    for (const sendTo of sendTos) {
      const protocols = new Set<NotificationProtocolType>();
      for (const protocol of sendTo.protocols) {
        protocols.add(protocol);
      }
      all.set(sendTo.userId, protocols);
    }
    return all;
  }

  private _getUserIdsForProtocol(sendToMap: SendToMap, protocol: Exclude<NotificationProtocolType, 'all'>) {
    const userIds: string[] = [];
    for (const [userId, protocols] of sendToMap) {
      if (protocols.has('any') || protocols.has(protocol)) {
        userIds.push(userId);
      }
    }
    return userIds;
  }

  async sendWebsocketMessageToUsers(userIds: string[], message: NotificationRequestInterface) {
    return await this.webSocketService.sendMessageToUsers(userIds, message);
  }

  async sendMessageTo(sendTos: NotificationSendToInterface[], message: NotificationRequestInterface) {

    // Remove all duplicate SendTos and duplicate protocols in case they exist
    const all = this._removeDuplicates(sendTos);

    const socketUserIds = this._getUserIdsForProtocol(all, 'socket');

    const successfullySentSocketIds = await this.sendWebsocketMessageToUsers(socketUserIds, message);

    for (const userId of successfullySentSocketIds) {
      all.delete(userId);
    }

    if (all.size === 0) {
      return;
    }

    const pushUserIds = this._getUserIdsForProtocol(all, 'push');

    const successfullySentPushIds = await this.firebaseService.sendMessageToUserIds(pushUserIds, message);

    for (const userId of successfullySentPushIds) {
      all.delete(userId);
    }

    if (all.size === 0) {
      return;
    }

    // TODO: Add email
  }

  async sendMessageToEveryoneExcept(userIds: string | string[], message: NotificationRequestInterface, protocols?: NotificationProtocolType[]) {
    if (! Array.isArray(userIds)) {
      userIds = [ userIds ];
    }

    if (!protocols) {
      protocols = [ 'any' ];
    }

    const users = await this.prismaService.user.findMany({
      where: {
        AND: [
          {
            id: {
              notIn: userIds
            }
          },
          {
            role: {
              in: [ Role.Admin, Role.User ]
            }
          }
        ]
      },
      select: {
        id: true
      }
    });

    const sendTos = this._createSendTosFromUserIds(users.map(x => x.id), protocols);

    await this.sendMessageTo(sendTos, message);
  }

  async sendMessageToAllAdmins(protocols: NotificationProtocolType[], message: NotificationRequestInterface) {
    const adminUsers = await this.prismaService.user.findMany({
      where: {
        role: Role.Admin
      },
      select: {
        id: true
      }
    });

    const sendTos = this._createSendTosFromUserIds(adminUsers.map(x => x.id), protocols);

    await this.sendMessageTo(sendTos, message);
  }

  private _createSendTosFromUserIds(userIds: string[], protocols: NotificationProtocolType[]) {
    const sendTos: NotificationSendToInterface[] = [];

    for (const userId of userIds) {
      sendTos.push({
        userId,
        protocols
      })
    }

    return sendTos;
  }
}
