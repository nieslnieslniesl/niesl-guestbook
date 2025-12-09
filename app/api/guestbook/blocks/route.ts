import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function requireAdmin() {
  if (!isAdminRequest()) {
    return NextResponse.json({ message: 'Niet geautoriseerd' }, { status: 401 });
  }
  return null;
}

export async function POST(request: Request) {
  const auth = requireAdmin();
  if (auth) return auth;

  const body = await request.json().catch(() => ({}));
  const { title, content, pinned = true, position = 0 } = body;
  if (!title || !content) {
    return NextResponse.json({ message: 'Ontbrekende velden' }, { status: 400 });
  }

  const block = await prisma.textBlock.create({
    data: {
      title: String(title).slice(0, 100),
      content: String(content).slice(0, 1000),
      pinned: Boolean(pinned),
      position: Number(position) || 0
    }
  });
  return NextResponse.json(block);
}

export async function PATCH(request: Request) {
  const auth = requireAdmin();
  if (auth) return auth;

  const body = await request.json().catch(() => ({}));
  const { id, title, content, pinned = true, position = 0 } = body;
  if (!id) return NextResponse.json({ message: 'ID vereist' }, { status: 400 });

  const block = await prisma.textBlock.update({
    where: { id: Number(id) },
    data: {
      title: title ? String(title).slice(0, 100) : undefined,
      content: content ? String(content).slice(0, 1000) : undefined,
      pinned: pinned === undefined ? undefined : Boolean(pinned),
      position: position === undefined ? undefined : Number(position)
    }
  });

  return NextResponse.json(block);
}

export async function DELETE(request: Request) {
  const auth = requireAdmin();
  if (auth) return auth;

  const body = await request.json().catch(() => ({}));
  const { id } = body;
  if (!id) return NextResponse.json({ message: 'ID vereist' }, { status: 400 });

  await prisma.textBlock.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}

