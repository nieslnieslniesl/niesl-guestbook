import clsx from 'clsx';
import React from 'react';

type Props = {
  color?: 'pink' | 'blue' | 'green';
  children: React.ReactNode;
  className?: string;
};

const variants: Record<NonNullable<Props['color']>, string> = {
  pink: 'from-[#ff5db1] to-[#ff9de1] text-white',
  blue: 'from-[#6ae3ff] to-[#b0f1ff] text-[#0c3c52]',
  green: 'from-[#5dffb6] to-[#a8ffda] text-[#0d4a34]'
};

export function Badge({ color = 'pink', children, className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow',
        'bg-gradient-to-r',
        variants[color],
        className
      )}
    >
      {children}
    </span>
  );
}

