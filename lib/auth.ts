import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_auth';

function getSecret(): string {
  const secret = process.env.ADMIN_COOKIE_SECRET || '';
  if (!secret) {
    console.warn('ADMIN_COOKIE_SECRET missing; using insecure default');
    return 'fallback-secret';
  }
  return secret;
}

function sign(value: string): string {
  const secret = getSecret();
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export function setAdminCookie() {
  const value = 'ok';
  const signature = sign(value);
  cookies().set(COOKIE_NAME, `${value}:${signature}`, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 6
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}

export function isAdminRequest(): boolean {
  const cookie = cookies().get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const [value, signature] = cookie.split(':');
  if (!value || !signature) return false;
  return sign(value) === signature;
}

