import { Module } from '@nestjs/common';
import { WebSocketController } from './web-socket.controller';
import { WebSocketService } from './web-socket.service';
import { WebSocketGateway } from './web-socket.gateway';
import { AuthModule } from '@mn/project-one/server/modules/auth';

@Module({
  controllers: [WebSocketController],
  providers: [WebSocketService, WebSocketGateway],
  exports: [WebSocketService],
  imports: [AuthModule]
})
export class WebSocketModule {}
