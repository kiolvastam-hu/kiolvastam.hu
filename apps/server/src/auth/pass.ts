import crypto from 'crypto';
import { promisify } from 'util';
import secret from './secret';

export default async function hashPassword(password: string) {
  const hash = await promisify(crypto.pbkdf2)(password, secret, 10000, 64, 'sha512');
  return hash.toString('hex');
}