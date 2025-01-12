import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway as _WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  DefaultSocketNamespace,
  PrivateEvent,
  SocketDirectoryPath,
  WebSocketErrorCodes
} from '@mn/project-one/shared/models';
import { WebSocketService } from './web-socket.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtVerifierService } from '@mn/project-one/server/modules/auth';

// TODO: Might have to add port number to env variable so prod works too
@_WebSocketGateway( {
  transports: ['websocket'],
  namespace: DefaultSocketNamespace,
  path: SocketDirectoryPath
})
// No need for this as we just created our own middleware which handles authentication
// Using just below would allow clients to still connect without valid credentials
// See https://github.com/nestjs/nest/issues/882
//@UseGuards(WebSocketGuard)
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  forbidUnknownValues: true,
  exceptionFactory: (errors) => {
    // TODO: We should use same exception logic as in main.ts
    const parsedConstraints = [];
    for (const error of errors) {
      for (const property in error.constraints) {
        // @ts-ignore
        parsedConstraints.push(JSON.parse(error.constraints[property]));
      }
    }
    return new WsException(parsedConstraints);
  },
}))
export class WebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private webSocketService: WebSocketService,
    private jwtVerifier: JwtVerifierService,
    private eventEmitter: EventEmitter2
  ) {
  }

  afterInit(server: Server) {
    this.webSocketService.setSocketServer(server);

    server.use((socket, next) => {
      try {
        const token = socket.handshake.auth['token'];

        // This will throw an error if not valid
        // Therefore we can just catch and return proper error code
        if (token && this.jwtVerifier.verify(token)) {
          next();
        }
      } catch (ex) {
        //console.log(ex);
        next(new Error(WebSocketErrorCodes.Unauthorized));
      }
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.webSocketService.addUserUsingConnectedSocket(client);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const publicId = this.webSocketService.getPublicIdUsingConnectedSocket(client);
    const matchingSockets = await this.server.in(publicId).fetchSockets();
    // If this is the last socket connected the length will be zero
    // This value could be greater if the user has multiple tabs open, or they are logged in on multiple platforms simultaneously
    // Example: Logged in on Web and Mobile app
    if (matchingSockets.length === 0) {
      this.webSocketService.removeUserUsingConnectedSocket(client);
    }

    this.webSocketService.removeUserUsingConnectedSocket(client);
  }



  @SubscribeMessage(PrivateEvent)
  async private(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
    return undefined;
    // const fromUser = this.webSocketService.getUserFromConnectedSocket(client);
    // const response = await this.messagingService.create(fromUser, data);
    //
    // if (isChannelIdDirect(response.message.channelId)) {
    //
    //   const toId = extractPublicIdFromDirectChannelId(fromUser.publicId, response.message.channelId);
    //
    //   const matchingSockets = await client.in(toId).fetchSockets();
    //
    //   // User is online, so we can send the message via socket
    //   if (matchingSockets.length) {
    //     // Send to both the recipient and also the user that created incase they have multiple tabs / devices open
    //     client.to(toId).to(fromUser.publicId).emit(PrivateEvent, response);
    //   } else {
    //     // Just update the connected user (all their other sockets)
    //     client.to(fromUser.publicId).emit(PrivateEvent, response);
    //     // Allow the notification service to handle notifying the other since they aren't online
    //     // TODO:
    //     this._emitCreatedEvent(response.message);
    //   }
    // } else {
    //   // TODO: POST TO CHANNEL
    //   console.log('NEED TO IMPLEMENT');
    // }
    //
    // return response;
  }

  // private _emitCreatedEvent(message: MessageEntity) {
  //   const messageCreatedEvent = new MessageCreatedEvent(message);
  //   this.eventEmitter.emit(MESSAGE_CREATED, messageCreatedEvent);
  // }

  //@SubscribeMessage(UsersEvent)
  //users(@ConnectedSocket() client: Socket): Observable<WsResponse<string[]>> {
  //  return undefined
  //}

  //@SubscribeMessage('events')
  //findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //  return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  //}
  //
  //@SubscribeMessage('identity')
  //async identity(@MessageBody() data: number): Promise<number> {
  //  return data;
  //}
}
