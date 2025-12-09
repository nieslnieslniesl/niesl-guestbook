import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!isAdminRequest()) {
      return NextResponse.json({ message: 'Niet geautoriseerd' }, { status: 401 });
    }

    const entries = await prisma.guestbookEntry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { message: 'Fout bij ophalen inzendingen', error: String(error) },
      { status: 500 }
    );
  }
}

