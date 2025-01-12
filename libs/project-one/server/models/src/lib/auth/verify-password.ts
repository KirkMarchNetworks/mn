import { verify } from 'argon2';

export async function verifyPassword(hashedPassword: string, password: string) {
  return await verify(hashedPassword, password)
}
