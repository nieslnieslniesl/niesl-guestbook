import React from 'react';
import { SparkleButton } from './SparkleButton';

type Props = {
  children: React.ReactNode;
  onBackToTop?: () => void;
};

export function HyvesShell({ children }: Props) {
  return (
    <div className="min-h-screen grid-bg relative">
      <div className="floating-hearts" />
      <header className="max-w-5xl mx-auto px-5 pt-10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-4xl font-black flex items-center gap-2">
            <span className="text-[#ff5db1]">Niesl</span>
            <span className="text-[#6ae3ff]">Hyves</span>
            <span className="text-[#ffd166] wobble">★</span>
          </div>
          <p className="mt-1 font-semibold">
            Gastenboek
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <SparkleButton variant="blue" as="a" href="https://niesl.nl">
            niesl.nl
          </SparkleButton>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-5 pb-20 pt-6 space-y-6">
        {children}
      </main>
      <footer className="max-w-5xl mx-auto px-5 pb-10 text-sm font-bold flex justify-between flex-wrap gap-3">
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

