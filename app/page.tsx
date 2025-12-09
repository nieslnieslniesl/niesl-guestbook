export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { GuestbookForm } from '@/components/GuestbookForm';
import { HyvesShell } from '@/components/HyvesShell';
import { EntryCard } from '@/components/EntryCard';
import { TextBlockCard } from '@/components/TextBlockCard';

export const revalidate = 10;

export default async function HomePage() {
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

  return (
    <HyvesShell>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {blocks.map((block) => (
            <TextBlockCard
              key={block.id}
              title={block.title}
              content={block.content}
            />
          ))}
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              name={entry.name}
              message={entry.message}
              imageUrl={entry.imagePath || undefined}
              createdAt={new Date(entry.createdAt).toLocaleString()}
            />
          ))}
        </div>
        <div className="space-y-4">
          <GuestbookForm />
          <div className="rainbow-border sparkle">
            <div className="inner space-y-2">
              <h3 className="text-lg font-black">House rules</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Keep it kind, keep it wild.</li>
                <li>Images are optional. Memes welcome.</li>
                <li>Entries are reviewed before going live.</li>
                <li>No spam; honeypots are watching 👀.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </HyvesShell>
  );
}

