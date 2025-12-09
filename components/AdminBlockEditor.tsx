'use client';

import { SparkleButton } from './SparkleButton';
import { useState } from 'react';

type Props = {
  block?: {
    id: number;
    title: string;
    content: string;
    pinned: boolean;
    position: number;
  };
  onSaved?: () => void;
};

export function AdminBlockEditor({ block, onSaved }: Props) {
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const method = block ? 'PATCH' : 'POST';
    const res = await fetch('/api/guestbook/blocks', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        id: block?.id ? Number(block.id) : undefined,
        pinned: payload.pinned === 'on'
      })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || 'Save failed');
      return;
    }
    onSaved?.();
    if (!block) event.currentTarget.reset();
  }

  async function handleDelete() {
    if (!block) return;
    const res = await fetch('/api/guestbook/blocks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: block.id })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || 'Delete failed');
      return;
    }
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit} className="rainbow-border sparkle">
      <div className="inner space-y-2">
        <div className="flex justify-between items-center gap-2">
          <h3 className="font-black">
            {block ? 'Edit Block' : 'New Text Block'}
          </h3>
          {block ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs font-bold underline"
            >
              Delete
            </button>
          ) : null}
        </div>
        <input
          name="title"
          className="input"
          defaultValue={block?.title}
          placeholder="Title"
          required
          maxLength={100}
        />
        <textarea
          name="content"
          className="input"
          rows={4}
          defaultValue={block?.content}
          placeholder="Content"
          required
          maxLength={1000}
        />
        <div className="flex items-center gap-2">
          <input
            id={`pinned-${block?.id ?? 'new'}`}
            name="pinned"
            type="checkbox"
            defaultChecked={block?.pinned ?? true}
          />
          <label htmlFor={`pinned-${block?.id ?? 'new'}`} className="text-sm">
            Pinned on homepage
          </label>
        </div>
        <input
          name="position"
          type="number"
          className="input"
          defaultValue={block?.position ?? 0}
          placeholder="Position (lower shows earlier)"
        />
        <SparkleButton type="submit" className="w-full justify-center">
          Save Block
        </SparkleButton>
        {error ? <div className="text-red-700 text-sm">{error}</div> : null}
      </div>
    </form>
  );
}

