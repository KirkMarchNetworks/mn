// TODO: Possibly upgrade to https://github.com/paralleldrive/cuid2
import { customAlphabet } from 'nanoid';

export const generateId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

