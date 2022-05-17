import clsx from 'clsx';
import { HTMLAttributes } from 'react';

export interface LettersAvatarProps extends HTMLAttributes<HTMLDivElement> {
  letters: string;
}

export default function LettersAvatar({ letters, className, ...props }: LettersAvatarProps) {
  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center bg-slate-400 text-white aspect-square',
        letters === '' && 'bg-slate-400/40', // skeleton
        className,
      )}
    >
      {letters.substring(0, 2)}
    </div>
  );
}