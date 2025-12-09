'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminEntryActions } from '@/components/AdminEntryActions';
import { AdminBlockEditor } from '@/components/AdminBlockEditor';

type Entry = {
  id: number;
  name: string;
  message: string;
  status: string;
  ipAddress: string;
  createdAt: string;
};

type Block = {
  id: number;
  title: string;
  content: string;
  imagePath?: string | null;
  pinned: boolean;
  position: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [entriesRes, blocksRes] = await Promise.all([
        fetch('/api/admin/entries'),
        fetch('/api/admin/blocks')
      ]);
      if (entriesRes.ok) {
        const entriesData = await entriesRes.json();
        setEntries(entriesData);
      }
      if (blocksRes.ok) {
        const blocksData = await blocksRes.json();
        setBlocks(blocksData);
      }
    } catch (err) {
      console.error('Failed to refresh:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  if (loading) {
    return <div className="p-6">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rainbow-border sparkle">
        <div className="inner">
          <h2 className="text-2xl font-black mb-4">Tekst Blokken</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminBlockEditor onSaved={refresh} />
            {blocks.map((block) => (
              <AdminBlockEditor
                key={block.id}
                block={{
                  id: block.id,
                  title: block.title,
                  content: block.content,
                  imagePath: block.imagePath,
                  pinned: block.pinned,
                  position: block.position
                }}
                onSaved={refresh}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="rainbow-border sparkle">
        <div className="inner">
          <h2 className="text-2xl font-black mb-4">Gastenboek Moderatie</h2>
          {entries.length === 0 ? (
            <p>Geen inzendingen</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-2">Naam</th>
                    <th>Bericht</th>
                    <th>Status</th>
                    <th>IP</th>
                    <th>Wanneer</th>
                    <th>Acties</th>
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
                        {new Date(entry.createdAt).toLocaleString('nl-NL')}
                      </td>
                      <td>
                        <AdminEntryActions
                          entryId={entry.id}
                          onUpdated={refresh}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

