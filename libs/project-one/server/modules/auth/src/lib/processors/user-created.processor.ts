import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { EmailService } from '@mn/project-one/server/modules/email';
import { AppName } from '@mn/project-one/server/modules/email';
import { UserCreatedEmail } from '../emails/user-created.email';
import { UserEntity } from '@mn/project-one/server/entities';

interface UserCreatedQueueInterface {
  user: UserEntity;
  confirmEmailToken: string;
}

export const UserCreatedQueueName = 'UserCreatedQueue';

export const InjectUserCreatedQueue = (): ParameterDecorator =>
  InjectQueue(UserCreatedQueueName);

export type UserCreatedQueueType = Queue<UserCreatedQueueInterface, boolean, string>
export type UserCreatedJobType = Job<UserCreatedQueueInterface, boolean, string>

@Processor(UserCreatedQueueName, {
  concurrency: 3,
})
export class UserCreatedProcessor extends WorkerHost {
  private readonly logger = new Logger(UserCreatedProcessor.name);

  constructor(private mailService: EmailService) {
    super();
  }
  async process(job: UserCreatedJobType): Promise<any> {
    const { user, confirmEmailToken} = job.data;

    // If email has yet to be verified
    if (!user.verifiedEmail) {
      // Send email to verify email ownership
      await this.mailService.send({
        email: user.email,
        subject: `Welcome to the ${AppName} Platform`,
        text: 'Please confirm your email.',
        html: UserCreatedEmail({
          userId: user.id,
          username: user.username,
          token: confirmEmailToken
        })
      })
    } else {
      // Send Welcome email
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Active ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Completed ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.log(`Failed ${job.id}`);
  }
}
