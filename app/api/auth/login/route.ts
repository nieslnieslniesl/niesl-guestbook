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
    return NextResponse.json({ message: 'Ongeldig wachtwoord' }, { status: 401 });
  }

  setAdminCookie();
  
  // Get proper host from headers or use request URL
  const host = request.headers.get('host') || new URL(request.url).host;
  const protocol = request.headers.get('x-forwarded-proto') || 
                   (request.url.startsWith('https') ? 'https' : 'http');
  const redirectUrl = `${protocol}://${host}/admin`;
  
  return NextResponse.redirect(redirectUrl);
}

