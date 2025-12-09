import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminRequest()) {
    return NextResponse.json({ message: 'Niet geautoriseerd' }, { status: 401 });
  }

  const blocks = await prisma.textBlock.findMany({
    orderBy: [
      { pinned: 'desc' },
      { position: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  return NextResponse.json(blocks);
}

