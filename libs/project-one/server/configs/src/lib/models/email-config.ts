import { registerAs } from "@nestjs/config";

export const emailConfig = registerAs('email', () => ({
  host: process.env['EMAIL_HOST'],
  port: parseInt(process.env['EMAIL_PORT'] || '', 10),
  user: process.env['EMAIL_USER'],
  password: process.env['EMAIL_PASSWORD'],
  fromAddress: process.env['EMAIL_FROM_ADDRESS'],
}));
