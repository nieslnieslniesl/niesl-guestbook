import { NextResponse } from 'next/server';
import { setAdminCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get('password')?.toString() || '';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { message: 'ADMIN_PASSWORD is not configured' },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
  }

  setAdminCookie();
  const redirectUrl = new URL('/admin', request.url);
  return NextResponse.redirect(redirectUrl);
}

