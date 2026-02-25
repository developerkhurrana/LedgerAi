import { getServerSession as getSession } from 'next-auth';
import { authOptions } from './config';

export { authOptions } from './config';

/** Get current session; uses authOptions so session includes user.id */
export async function getServerSession() {
  return getSession(authOptions);
}
