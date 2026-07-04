import { getAuthToken, verifyToken } from './auth';
import type { JwtPayload } from '@/types';

export async function getAuthenticatedUser(): Promise<JwtPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<JwtPayload> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('未登录');
  }
  return user;
}
