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
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Welkom op het Gastenboek! 🎉
          </h1>
          <p className="text-lg font-semibold">
            Laat hier je bericht achter voor de wereld om te zien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {blocks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-black flex items-center gap-2">
                  📌 Aankondigingen
                </h2>
                {blocks.map((block) => (
                  <TextBlockCard
                    key={block.id}
                    title={block.title}
                    content={block.content}
                  />
                ))}
              </div>
            )}
            
            {entries.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-black flex items-center gap-2">
                  💬 Gastenboek Berichten
                </h2>
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
                  <p className="text-lg font-semibold">
                    Nog geen berichten! Wees de eerste! 🚀
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <GuestbookForm />
            <div className="rainbow-border sparkle">
              <div className="inner space-y-2">
                <h3 className="text-lg font-black">📋 Huisregels</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Wees lief, wees wild.</li>
                  <li>Afbeeldingen zijn optioneel. Memes welkom.</li>
                  <li>Berichten worden beoordeeld voordat ze live gaan.</li>
                  <li>Geen spam; honeypots houden je in de gaten 👀.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HyvesShell>
  );
}

