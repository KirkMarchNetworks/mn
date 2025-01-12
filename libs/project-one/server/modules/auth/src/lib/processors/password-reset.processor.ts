import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { PasswordResetEmail } from '../emails/password-reset.email';
import { EmailService } from '@mn/project-one/server/modules/email';
import { UserEntity } from '@mn/project-one/server/entities';

interface PasswordResetQueueInterface {
  user: UserEntity;
  token: string;
}

export const PasswordResetQueueName = 'PasswordResetQueue';

export const InjectPasswordResetQueue = (): ParameterDecorator =>
  InjectQueue(PasswordResetQueueName);

export type PasswordResetQueueType = Queue<PasswordResetQueueInterface, boolean, string>
export type PasswordResetJobType = Job<PasswordResetQueueInterface, boolean, string>

@Processor(PasswordResetQueueName, {
  concurrency: 3,
})
export class PasswordResetProcessor extends WorkerHost {
  private readonly logger = new Logger(PasswordResetProcessor.name);

  constructor(private mailService: EmailService) {
    super();
  }
  async process(job: PasswordResetJobType): Promise<any> {
    const { user, token} = job.data;

    await this.mailService.send({
      email: user.email,
      subject: 'Reset your password.',
      text: "Let's reset your password",
      html: PasswordResetEmail({
        userId: user.id,
        username: user.username,
        token
      })
    })
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
