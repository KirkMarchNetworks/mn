import { Injectable } from '@nestjs/common';
import { Server, Socket, RemoteSocket } from 'socket.io';
import { jwtDecode } from 'jwt-decode';
import { createStore, filterNil } from '@ngneat/elf';
import {
  deleteEntities,
  selectAllEntities,
  upsertEntities,
  withEntities
} from '@ngneat/elf-entities';
import { map, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, firstValueFrom, take } from 'rxjs';
import { JwtParsedTokenInterface } from '@mn/project-one/server/models';
import { PrivateEvent, UsersEvent } from '@mn/project-one/shared/models';
import { NotificationRequestInterface } from '@mn/project-one/shared/notification-models';

@Injectable()
export class WebSocketService {
  private store = createStore(
    { name: 'users'},
    withEntities<JwtParsedTokenInterface, 'sub'>({ idKey: 'sub' }),
  );

  private _serverSubject = new BehaviorSubject<Server|null>(null);
  private server$ = this._serverSubject.asObservable().pipe(
    shareReplay(1),
    filterNil(),
  )

  users$ = this.store.pipe(selectAllEntities());

  publicUsers$ = this.users$.pipe(
    map(users => users.map(x => {
      return {
        publicId: x.publicId,
        username: x.username,
        // TODO: add avatarUrl
      } // as SimplifiedPublicUserEntity
    }))
  );


  constructor() {
    combineLatest([
      this.publicUsers$,
      this.server$
    ]).subscribe(([ usernames, server ]) => {
      server.emit(UsersEvent, usernames);
    })
  }

  setSocketServer(server: Server) {
    this._serverSubject.next(server);
  }

  /**
   * Sends a socket message to all users within sendTo array.
   * Returns all users which it sent a message to
   */
  async sendMessageToUsers(userIds: string[], message: NotificationRequestInterface) {
    const users = await firstValueFrom(this.users$);
    const onlineUsers = users.filter(x => userIds.includes(x.sub));

    if (onlineUsers.length === 0) {
      return [];
    }

    const server = await firstValueFrom(this.server$);

    const successfullySentUserIds: string[] = [];
    for (const user of onlineUsers) {
      const matchingSockets = await server.in(user.publicId).fetchSockets();
      let sentSuccessfully = false;
      if (matchingSockets.length) {
        for (const socket of matchingSockets) {
          if (this.sendPrivateMessage(socket, message)) {
            if (! sentSuccessfully) {
              sentSuccessfully = true;
            }
          }
        }
      }
      if (sentSuccessfully) {
        successfullySentUserIds.push(user.sub);
      }
    }

    return successfullySentUserIds;
  }

  sendPrivateMessage(socket: RemoteSocket<any, any>, { action }: NotificationRequestInterface): boolean {
    if (action) {
      socket.emit(PrivateEvent, action);
      return true;
    }
    return false;
  }

  removeUserUsingConnectedSocket(client: Socket) {
    const user = this.getUserFromConnectedSocket(client);

    this.store.update(
      deleteEntities(user.sub)
    );
  }

  addUserUsingConnectedSocket(client: Socket) {
    const user = this.getUserFromConnectedSocket(client);

    // Let them join their private room
    client.join(user.publicId);

    this.store.update(
      upsertEntities(user)
    );
  }

  getUserFromConnectedSocket(client: Socket) {
    const token = client.handshake.auth['token'];
    return jwtDecode<JwtParsedTokenInterface>(token);
  }

  getPublicIdUsingConnectedSocket(client: Socket) {
    const user = this.getUserFromConnectedSocket(client);
    return user.publicId;
  }

  //async sendMessageViaSocket({user, message}: MessageCreatedEvent): Promise<boolean> {
  //  const server = await firstValueFrom(this.server$);
  //
  //  if (isChannelIdDirect(message.channelId)) {
  //    const toId = extractPublicIdFromDirectChannelId(user.publicId, message.channelId);
  //
  //    const matchingSockets = await server.in(toId).fetchSockets();
  //
  //    // User online so we can send the message via socket
  //    if (matchingSockets.length) {
  //      // Send to both the recipient and also the user that created incase they have multiple tabs / devices open
  //      server.to(toId).to(user.publicId).emit(PrivateEvent, message);
  //      return true;
  //    } else {
  //      server.to(user.publicId).emit(PrivateEvent, message);
  //      return false;
  //    }
  //  } else {
  //    // TODO: POST TO CHANNEL
  //    console.log('NEED TO IMPLEMENT');
  //    return false;
  //  }
  //}
}
