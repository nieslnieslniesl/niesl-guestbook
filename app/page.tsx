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
          {blocks.length > 0 && (
            <div className="space-y-4">
              {blocks.map((block) => (
                <TextBlockCard
                  key={block.id}
                  title={block.title}
                  content={block.content}
                  imagePath={block.imagePath || undefined}
                />
              ))}
            </div>
          )}
          
          {entries.length > 0 && (
            <div className="space-y-4">
              {entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  name={entry.name}
                  message={entry.message}
                  imageUrl={entry.imagePath || undefined}
                  createdAt={new Date(entry.createdAt).toLocaleString('nl-NL')}
                />
              ))}
            </div>
          )}

          {blocks.length === 0 && entries.length === 0 && (
            <div className="rainbow-border sparkle">
              <div className="inner text-center py-8">
                <p>Nog geen berichten</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <GuestbookForm />
          <div className="rainbow-border sparkle">
            <div className="inner space-y-2">
              <h3 className="text-lg font-black">Huisregels</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Berichten worden beoordeeld voordat ze zichtbaar zijn</li>
                <li>Afbeeldingen zijn optioneel (max 2MB)</li>
                <li>Geen spam</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </HyvesShell>
  );
}

