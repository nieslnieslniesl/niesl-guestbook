import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

function requireAdmin() {
  if (!isAdminRequest()) {
    return NextResponse.json({ message: 'Niet geautoriseerd' }, { status: 401 });
  }
  return null;
}

async function handleImageUpload(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Afbeelding te groot (max 5MB)');
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || '.png';
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filename = `${crypto.randomUUID()}${ext}`;
  const target = path.join(uploadDir, filename);
  await fs.writeFile(target, buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  const auth = requireAdmin();
  if (auth) return auth;

  const formData = await request.formData();
  const title = formData.get('title')?.toString() || '';
  const content = formData.get('content')?.toString() || '';
  const pinned = formData.get('pinned') === 'on';
  const position = Number(formData.get('position') || 0);
  const file = formData.get('image') as File | null;

  if (!title || !content) {
    return NextResponse.json({ message: 'Ontbrekende velden' }, { status: 400 });
  }

  let imagePath: string | null = null;
  try {
    imagePath = await handleImageUpload(file);
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  }

  const block = await prisma.textBlock.create({
    data: {
      title: title.slice(0, 100),
      content: content.slice(0, 1000),
      imagePath,
      pinned,
      position
    }
  });
  return NextResponse.json(block);
}

export async function PATCH(request: Request) {
  const auth = requireAdmin();
  if (auth) return auth;

  const formData = await request.formData();
  const id = formData.get('id')?.toString();
  if (!id) return NextResponse.json({ message: 'ID vereist' }, { status: 400 });

  const existing = await prisma.textBlock.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json({ message: 'Blok niet gevonden' }, { status: 404 });
  }

  const title = formData.get('title')?.toString();
  const content = formData.get('content')?.toString();
  const pinned = formData.get('pinned') === 'on';
  const position = formData.get('position')?.toString();
  const file = formData.get('image') as File | null;

  let imagePath: string | null | undefined = undefined;
  if (file && file.size > 0) {
    try {
      imagePath = await handleImageUpload(file);
    } catch (err) {
      return NextResponse.json({ message: (err as Error).message }, { status: 400 });
    }
  }

  const block = await prisma.textBlock.update({
    where: { id: Number(id) },
    data: {
      title: title ? title.slice(0, 100) : undefined,
      content: content ? content.slice(0, 1000) : undefined,
      imagePath,
      pinned: pinned !== undefined ? pinned : undefined,
      position: position !== undefined ? Number(position) : undefined
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

