import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FirebaseModule } from '@mn/project-one/server/modules/firebase';
import { WebSocketModule } from '@mn/project-one/server/modules/web-socket';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [
    FirebaseModule,
    WebSocketModule
  ]
})
export class NotificationModule {}
