'use client';

import React, { useState } from 'react';
import { SparkleButton } from './SparkleButton';

type Props = {
  onSubmitted?: () => void;
};

export function GuestbookForm({ onSubmitted }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setError('');

    const formData = new FormData(event.currentTarget);
    try {
      const res = await fetch('/api/guestbook/submit', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Verzenden mislukt');
      }
      setStatus('success');
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
      onSubmitted?.();
    } catch (err) {
      setStatus('error');
      setError((err as Error).message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rainbow-border sparkle">
      <div className="inner space-y-3">
        <h3 className="text-xl font-black flex items-center gap-2">
          ✍️ Schrijf in het gastenboek
          <span className="badge">Wees lief, wees luid!</span>
        </h3>
        <input
          className="input"
          name="name"
          placeholder="Jouw legendarische naam"
          required
          maxLength={50}
        />
        <textarea
          className="input"
          name="message"
          placeholder="Laat je nostalgische shout-out achter..."
          required
          maxLength={500}
          rows={4}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="text-sm"
        />
        <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
          <input tabIndex={-1} name="nickname" />
        </div>
        <SparkleButton
          type="submit"
          disabled={status === 'loading'}
          className="w-full justify-center"
        >
          {status === 'loading' ? 'Verzenden...' : 'Plaats in gastenboek'}
        </SparkleButton>
        {status === 'success' ? (
          <div className="text-green-700 font-bold">Verzonden! Wacht op goedkeuring 💖</div>
        ) : null}
        {status === 'error' ? (
          <div className="text-red-700 font-bold">{error}</div>
        ) : null}
      </div>
    </form>
  );
}

