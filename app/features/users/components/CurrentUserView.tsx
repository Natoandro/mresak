import clsx from 'clsx';
import { HTMLAttributes, useMemo } from 'react';
import LettersAvatar from '~/app/commons/components/LettersAvatar';
import TextSkeleton from '~/app/commons/components/TextSkeleton';
import { getInitials } from '~/app/commons/lib/utils/string';
import { useAppSelector } from '~/app/hooks';
import { selectCurrentUser } from '../userSlice';

export interface CurrentUserViewProps extends HTMLAttributes<HTMLDivElement> { }

export default function CurrentUserView({ className, ...props }: CurrentUserViewProps) {
  const user = useAppSelector(selectCurrentUser);

  const name = user?.name;
  const initials = useMemo(() => (
    (name && getInitials(name)) ?? ''
  ), [name]);

  return (
    <div className={clsx('flex px-3 py-2 flex items-center', className)} {...props}>
      <LettersAvatar letters={initials} className="mr-2 w-8 h-8" />
      <span>{user?.name ?? <TextSkeleton className="w-32 h-4" />}</span>
      <span className="text-gray-400 mx-2">&bull;</span>
      <span className="text-gray-500 flex items-center">@{user?.login ?? <TextSkeleton className="w-8 h-4" />}</span>
    </div>
  );
}