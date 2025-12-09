import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const trap = formData.get('nickname')?.toString();
  if (trap) {
    return NextResponse.json({ message: 'Spam detected' }, { status: 400 });
  }

  const name = (formData.get('name') || '').toString().trim().slice(0, 50);
  const message = (formData.get('message') || '').toString().trim().slice(0, 500);
  const file = formData.get('image') as File | null;

  if (!name || !message) {
    return NextResponse.json({ message: 'Name and message are required' }, { status: 400 });
  }

  let imagePath: string | null = null;
  if (file && file.size > 0) {
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ message: 'Image too large (max 2MB)' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.png';
    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filename = `${crypto.randomUUID()}${ext}`;
    const target = path.join(uploadDir, filename);
    await fs.writeFile(target, buffer);
    imagePath = `/uploads/${filename}`;
  }

  const ipAddress = clientIp(request);

  const entry = await prisma.guestbookEntry.create({
    data: {
      name,
      message,
      imagePath,
      status: 'PENDING',
      ipAddress,
      logs: {
        create: { action: 'CREATED' }
      }
    }
  });

  return NextResponse.json({ id: entry.id, status: 'pending' });
}

