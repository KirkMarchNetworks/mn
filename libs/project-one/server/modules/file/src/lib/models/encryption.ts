import { createCipheriv, randomBytes, createDecipheriv, BinaryLike } from 'crypto';

const IV_LENGTH = 16; // For AES, this is always 16

// Use this function to generate a new key which can then be stored in the .env file
// function getEncryptionKey() {
//   // The key length is dependent on the algorithm.
//   // In this case for aes256, it is 32 bytes.
//   return randomBytes(32).toString('hex').substring(0, 32);
// }

export function encrypt(encryptionKey: string, text: BinaryLike) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  const encrypted = cipher.update(text);

  return Buffer.concat([iv, encrypted, cipher.final()]);
}

export function createDecrypter(encryptionKey: string, iv: Buffer) {
  return createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
}

//export function decrypt(buffer: Buffer) {
//  const iv = buffer.subarray(0, IV_LENGTH);
//  let decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
//  const test = buffer.subarray(IV_LENGTH, buffer.length);
//  let decrypted = decipher.update(buffer.subarray(16, buffer.length));
//
//  return Buffer.concat([decrypted]);
//}

// export function encryptToText(text: BinaryLike) {
//   const encrypted = encrypt(text);
//
//   return encrypted.toString('hex');
// }

// export function decryptToText(buffer: Buffer) {
//   const iv = buffer.subarray(0, IV_LENGTH);
//
//   const decrypted = createDecrypter(buffer);
//
//   return decrypted.toString();
// }
