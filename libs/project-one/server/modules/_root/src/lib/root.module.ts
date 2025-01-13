import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { config, redisConfig } from '@mn/project-one/server/configs';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BasicAuthMiddleware } from '@mn/project-one/server/middlewares';
import { AuthModule } from '@mn/project-one/server/modules/auth';
import { RoleModule } from '@mn/project-one/server/modules/role';
import { TenantModule } from '@mn/project-one/server/modules/tenant';
import { UserModule } from '@mn/project-one/server/modules/user';
import { HealthModule } from '@mn/project-one/server/modules/health';
import { PermissionModule } from '@mn/project-one/server/modules/permission';
import { FileModule } from '@mn/project-one/server/modules/file';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LicenseModule } from '@mn/project-one/server/modules/license';
import { LicensedProductModule } from '@mn/project-one/server/modules/licensed-product';
import { IntelligentRetrievalModule } from '@mn/project-one/server/modules/intelligent-retrieval';
import { DeviceAndChannelModule } from '@mn/project-one/server/modules/device-and-channel';
import { WebSocketModule } from '@mn/project-one/server/modules/web-socket';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),
    BullModule.forRootAsync({
      inject: [redisConfig.KEY],
      useFactory: ({
        host,
        port,
        password,
      }: ConfigType<typeof redisConfig>) => ({
        connection: {
          host,
          port,
          password,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
      middleware: BasicAuthMiddleware,
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    AuthModule,
    HealthModule,
    LicenseModule,
    LicensedProductModule,
    RoleModule,
    PermissionModule,
    TenantModule,
    UserModule,
    WebSocketModule,
    FileModule,
    IntelligentRetrievalModule,
    DeviceAndChannelModule,
  ],
})
export class RootModule {}
