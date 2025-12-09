import prisma from '@/lib/prisma';
import { AdminEntryActions } from '@/components/AdminEntryActions';
import { AdminBlockEditor } from '@/components/AdminBlockEditor';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [entries, blocks] = await Promise.all([
    prisma.guestbookEntry.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.textBlock.findMany({
      orderBy: [
        { pinned: 'desc' },
        { position: 'asc' },
        { createdAt: 'desc' }
      ]
    })
  ]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminBlockEditor onSaved={() => location.reload()} />
        {blocks.map((block) => (
          <AdminBlockEditor
            key={block.id}
            block={{
              id: block.id,
              title: block.title,
              content: block.content,
              pinned: block.pinned,
              position: block.position
            }}
            onSaved={() => location.reload()}
          />
        ))}
      </section>

      <section className="rainbow-border sparkle">
        <div className="inner">
          <h2 className="text-2xl font-black mb-4">Guestbook moderation</h2>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2">Name</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>IP</th>
                  <th>When</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-white/60">
                    <td className="py-2 font-bold">{entry.name}</td>
                    <td className="max-w-xs">{entry.message}</td>
                    <td>{entry.status}</td>
                    <td className="text-xs">{entry.ipAddress}</td>
                    <td className="text-xs">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <AdminEntryActions
                        entryId={entry.id}
                        onUpdated={() => location.reload()}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

