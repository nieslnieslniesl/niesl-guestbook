import clsx from 'clsx';
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

type Props = (ButtonProps | AnchorProps) & {
  as?: 'button' | 'a';
  variant?: 'pink' | 'blue' | 'yellow';
};

const colors: Record<NonNullable<Props['variant']>, string> = {
  pink:
    'from-[#ff5db1] via-[#ff85c2] to-[#ffbde1] text-white shadow-[0_10px_25px_rgba(255,93,177,0.35)]',
  blue:
    'from-[#6ae3ff] via-[#8ff3ff] to-[#c7f9ff] text-[#0c3c52] shadow-[0_10px_25px_rgba(106,227,255,0.3)]',
  yellow:
    'from-[#ffd166] via-[#ffe599] to-[#fff2c2] text-[#7a4b00] shadow-[0_10px_25px_rgba(255,209,102,0.35)]'
};

export function SparkleButton(props: Props) {
  const { children, className, variant = 'pink', as = 'button', ...rest } = props;
  const classes = clsx(
    'sparkle wobble px-5 py-3 rounded-full font-bold text-sm uppercase tracking-wide',
    'bg-gradient-to-r border-2 border-white/60',
    'transition-all duration-150 active:translate-y-1',
    colors[variant],
    className
  );

  if (as === 'a') {
    const anchorProps = rest as AnchorProps;
    return (
      <a {...anchorProps} className={classes}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as ButtonProps;
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}

