import clsx from 'clsx';
import { HTMLAttributes, memo } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  big?: boolean;
}

export default memo(function Avatar({ name, className, big = false, ...props }: AvatarProps) {
  return (
    <div
      className={clsx(
        'rounded-full bg-slate-400 flex items-center justify-center text-white',
        getClassName(big),
        className
      )}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
});

function getInitials(fullname: string) {
  return fullname
    .split(' ')
    .map((name) => name[0])
    .filter((_, i, arr) => i === 0 || i === arr.length - 1);
}

function getClassName(big: boolean) {
  if (big) return 'w-48 h-48 text-8xl';
  return 'w-8 h-8 ';
}
