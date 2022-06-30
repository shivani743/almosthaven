import { randomBytes } from 'crypto';

export function generateActivationToken() {
  return randomBytes(20).toString('hex');
}
