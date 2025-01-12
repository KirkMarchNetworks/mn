import { registerAs } from "@nestjs/config";

export const firebaseConfig = registerAs('firebase', () => ({
  serviceAccountPath: process.env['FIREBASE_SERVICE_ACCOUNT_PATH'],
}));
