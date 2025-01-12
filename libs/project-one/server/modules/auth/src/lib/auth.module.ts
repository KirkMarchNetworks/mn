import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from './models/secret-key';
import { JwtStrategy } from './services/jwt.strategy';
import { JwtService } from './services/jwt.service';
import { JwtVerifierService } from './services/jwt-verifier.service';
import { UserRepoModule } from '@mn/project-one/server/repos/user';
import { PasswordResetProcessor, PasswordResetQueueName } from './processors/password-reset.processor';
import { EmailModule } from '@mn/project-one/server/modules/email';
import { QueueModule } from '@mn/project-one/server/modules/queue';
import { UserCreatedProcessor, UserCreatedQueueName } from './processors/user-created.processor';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule.register({}),
    JwtModule.register({
      secret: secretKey
    }),
    UserRepoModule,

    EmailModule,

    QueueModule.registerQueue(PasswordResetQueueName),
    QueueModule.registerQueue(UserCreatedQueueName),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtService,
    JwtVerifierService,

    PasswordResetProcessor,
    UserCreatedProcessor
  ],
  exports: [
    // We can export this service, so other services, which need to verify JWT can verify them
    // Example web-socket.gateway.ts
    JwtVerifierService
  ],
})
export class AuthModule {}
