import { randomBytes } from 'crypto';

export function generateFileId() {
  return randomBytes(16).toString('hex');
}
