'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminEntryActions } from '@/components/AdminEntryActions';
import { AdminBlockEditor } from '@/components/AdminBlockEditor';

type Entry = {
  id: number;
  name: string;
  message: string;
  imagePath?: string | null;
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
  const [activeTab, setActiveTab] = useState<'blocks' | 'entries'>('entries');

  const refresh = async () => {
    try {
      const [entriesRes, blocksRes] = await Promise.all([
        fetch('/api/admin/entries', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/admin/blocks', { credentials: 'include', cache: 'no-store' })
      ]);
      
      if (!entriesRes.ok) {
        if (entriesRes.status === 401) {
          router.push('/admin/login');
          return;
        }
        console.error('Failed to fetch entries:', entriesRes.status);
        setEntries([]);
      } else {
        const entriesData = await entriesRes.json();
        setEntries(Array.isArray(entriesData) ? entriesData : []);
      }
      
      if (!blocksRes.ok) {
        if (blocksRes.status === 401) {
          router.push('/admin/login');
          return;
        }
        console.error('Failed to fetch blocks:', blocksRes.status);
        setBlocks([]);
      } else {
        const blocksData = await blocksRes.json();
        setBlocks(Array.isArray(blocksData) ? blocksData : []);
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

  const pendingEntries = entries.filter(e => e.status === 'PENDING');
  const approvedEntries = entries.filter(e => e.status === 'APPROVED');
  const rejectedEntries = entries.filter(e => e.status === 'REJECTED');

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-white/30">
        <button
          onClick={() => setActiveTab('entries')}
          className={`px-4 py-2 font-bold ${
            activeTab === 'entries'
              ? 'border-b-4 border-[#ff5db1]'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          Inzendingen ({entries.length})
        </button>
        <button
          onClick={() => setActiveTab('blocks')}
          className={`px-4 py-2 font-bold ${
            activeTab === 'blocks'
              ? 'border-b-4 border-[#ff5db1]'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          Homepage Blokken ({blocks.length})
        </button>
      </div>

      {/* Entries Tab */}
      {activeTab === 'entries' && (
        <div className="space-y-4">
          {pendingEntries.length > 0 && (
            <section className="rainbow-border sparkle">
              <div className="inner">
                <h2 className="text-2xl font-black mb-4">
                  Wachtend op goedkeuring ({pendingEntries.length})
                </h2>
                <div className="space-y-3">
                  {pendingEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border-2 border-yellow-300 rounded-lg p-4 bg-yellow-50/50"
                    >
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="flex-1">
                          <div className="font-bold text-lg mb-1">{entry.name}</div>
                          <p className="mb-2">{entry.message}</p>
                          {entry.imagePath && (
                            <img
                              src={entry.imagePath}
                              alt="Upload"
                              className="max-w-xs max-h-48 rounded border-2 border-gray-300 mt-2"
                            />
                          )}
                          <div className="text-xs text-gray-600 mt-2">
                            {new Date(entry.createdAt).toLocaleString('nl-NL')} • {entry.ipAddress}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <AdminEntryActions entryId={entry.id} onUpdated={refresh} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {approvedEntries.length > 0 && (
            <section className="rainbow-border sparkle">
              <div className="inner">
                <h2 className="text-2xl font-black mb-4">
                  Goedgekeurd ({approvedEntries.length})
                </h2>
                <div className="space-y-2">
                  {approvedEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border-l-4 border-green-500 pl-4 py-2"
                    >
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="flex-1">
                          <span className="font-bold">{entry.name}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {new Date(entry.createdAt).toLocaleString('nl-NL')}
                          </span>
                          <p className="mt-1">{entry.message}</p>
                        </div>
                        <AdminEntryActions entryId={entry.id} onUpdated={refresh} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {rejectedEntries.length > 0 && (
            <section className="rainbow-border sparkle">
              <div className="inner">
                <h2 className="text-2xl font-black mb-4">
                  Afgewezen ({rejectedEntries.length})
                </h2>
                <div className="space-y-2">
                  {rejectedEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border-l-4 border-red-500 pl-4 py-2 opacity-60"
                    >
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="flex-1">
                          <span className="font-bold">{entry.name}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {new Date(entry.createdAt).toLocaleString('nl-NL')}
                          </span>
                          <p className="mt-1">{entry.message}</p>
                        </div>
                        <AdminEntryActions entryId={entry.id} onUpdated={refresh} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {entries.length === 0 && (
            <div className="rainbow-border sparkle">
              <div className="inner text-center py-8">
                <p>Geen inzendingen gevonden</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Blocks Tab */}
      {activeTab === 'blocks' && (
        <div className="space-y-4">
          <section className="rainbow-border sparkle">
            <div className="inner">
              <h2 className="text-2xl font-black mb-4">Nieuw Blok Toevoegen</h2>
              <AdminBlockEditor onSaved={refresh} />
            </div>
          </section>

          {blocks.length > 0 && (
            <section className="rainbow-border sparkle">
              <div className="inner">
                <h2 className="text-2xl font-black mb-4">Bestaande Blokken</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          )}
        </div>
      )}
    </div>
  );
}
