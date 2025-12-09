export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 5;

export async function GET() {
  const [blocks, entries] = await Promise.all([
    prisma.textBlock.findMany({
      orderBy: [
        { pinned: 'desc' },
        { position: 'asc' },
        { createdAt: 'desc' }
      ]
    }),
    prisma.guestbookEntry.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return NextResponse.json({ blocks, entries });
}

