import { Inject, Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { SendEmailInterface } from './models/send-email.interface';
import { emailConfig } from '@mn/project-one/server/configs';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>
  ) {
    this.transporter = createTransport({
      host: config.host,
      port: config.port,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
  }
  async send({ email, subject, text, html }: SendEmailInterface) {
    const info = await this.transporter.sendMail({
      from: this.config.fromAddress, // sender address
      to: email, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
  }
}
