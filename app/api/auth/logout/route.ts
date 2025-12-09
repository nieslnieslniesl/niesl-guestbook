import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/auth';

export async function GET(request: Request) {
  clearAdminCookie();
  const redirectUrl = new URL('/', request.url);
  return NextResponse.redirect(redirectUrl);
}

