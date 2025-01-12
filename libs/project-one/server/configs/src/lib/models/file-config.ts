import { registerAs } from "@nestjs/config";

export const fileConfig = registerAs('file', () => ({
  encryptionKey: process.env['FILE_ENCRYPTION_KEY']
}));
