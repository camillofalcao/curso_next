'use server'

import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import { unauthorized } from 'next/navigation';

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    //Lança o erro 401 - Unauthorized
    unauthorized();
  }
  return session.user;
}
