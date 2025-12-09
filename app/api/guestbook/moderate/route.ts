import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isAdminRequest()) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { action, entryId } = body as { action?: string; entryId?: number };
  if (!action || !entryId) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const entry = await prisma.guestbookEntry.findUnique({ where: { id: entryId } });
  if (!entry) {
    return NextResponse.json({ message: 'Entry not found' }, { status: 404 });
  }

  switch (action) {
    case 'APPROVE':
      await prisma.$transaction([
        prisma.guestbookEntry.update({
          where: { id: entryId },
          data: { status: 'APPROVED' }
        }),
        prisma.moderationLog.create({
          data: { action: 'APPROVED', entryId }
        })
      ]);
      break;
    case 'REJECT':
      await prisma.$transaction([
        prisma.guestbookEntry.update({
          where: { id: entryId },
          data: { status: 'REJECTED' }
        }),
        prisma.moderationLog.create({
          data: { action: 'REJECTED', entryId }
        })
      ]);
      break;
    case 'DELETE':
      await prisma.$transaction([
        prisma.moderationLog.create({
          data: { action: 'DELETED', entryId }
        }),
        prisma.guestbookEntry.delete({ where: { id: entryId } })
      ]);
      break;
    default:
      return NextResponse.json({ message: 'Unsupported action' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

