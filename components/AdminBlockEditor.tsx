'use client';

import { SparkleButton } from './SparkleButton';
import { useState } from 'react';

type Props = {
  block?: {
    id: number;
    title: string;
    content: string;
    imagePath?: string | null;
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
    const method = block ? 'PATCH' : 'POST';
    const res = await fetch('/api/guestbook/blocks', {
      method,
      body: formData
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || 'Opslaan mislukt');
      return;
    }
    onSaved?.();
    if (!block && event.currentTarget) {
      event.currentTarget.reset();
    }
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
      setError(data?.message || 'Verwijderen mislukt');
      return;
    }
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit} className="rainbow-border sparkle">
      <div className="inner space-y-2">
        <div className="flex justify-between items-center gap-2">
          <h3 className="font-black">
            {block ? 'Blok Bewerken' : 'Nieuw Tekst Blok'}
          </h3>
          {block ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs font-bold underline"
            >
              Verwijderen
            </button>
          ) : null}
        </div>
        <input
          name="title"
          className="input"
          defaultValue={block?.title}
          placeholder="Titel"
          required
          maxLength={100}
        />
        <textarea
          name="content"
          className="input"
          rows={4}
          defaultValue={block?.content}
          placeholder="Inhoud"
          required
          maxLength={1000}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="text-sm"
        />
        {block?.imagePath && (
          <div className="text-xs text-gray-600">
            Huidige afbeelding: <a href={block.imagePath} target="_blank" rel="noopener noreferrer" className="underline">{block.imagePath}</a>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            id={`pinned-${block?.id ?? 'new'}`}
            name="pinned"
            type="checkbox"
            defaultChecked={block?.pinned ?? true}
          />
          <label htmlFor={`pinned-${block?.id ?? 'new'}`} className="text-sm">
            Vastzetten op homepage
          </label>
        </div>
        <input
          name="position"
          type="number"
          className="input"
          defaultValue={block?.position ?? 0}
          placeholder="Positie (lager = eerder)"
        />
        {block?.id && (
          <input type="hidden" name="id" value={block.id} />
        )}
        <SparkleButton type="submit" className="w-full justify-center">
          Blok Opslaan
        </SparkleButton>
        {error ? <div className="text-red-700 text-sm">{error}</div> : null}
      </div>
    </form>
  );
}

