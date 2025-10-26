'use server'

import { getServerSession } from 'next-auth/next';
import { OPTIONS as authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    const err: any = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  return session.user;
}
