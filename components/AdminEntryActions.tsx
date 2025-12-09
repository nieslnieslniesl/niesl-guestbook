'use client';

import { SparkleButton } from './SparkleButton';

type Props = {
  entryId: number;
  onUpdated?: () => void;
};

async function send(action: string, entryId: number) {
  const res = await fetch('/api/guestbook/moderate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, entryId })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || 'Action failed');
  }
}

export function AdminEntryActions({ entryId, onUpdated }: Props) {
  const handle = async (action: string) => {
    await send(action, entryId);
    onUpdated?.();
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <SparkleButton
        variant="yellow"
        type="button"
        onClick={() => handle('APPROVE')}
        className="text-xs"
      >
        Approve
      </SparkleButton>
      <SparkleButton
        variant="pink"
        type="button"
        onClick={() => handle('REJECT')}
        className="text-xs"
      >
        Reject
      </SparkleButton>
      <SparkleButton
        variant="blue"
        type="button"
        onClick={() => handle('DELETE')}
        className="text-xs"
      >
        Delete
      </SparkleButton>
    </div>
  );
}

