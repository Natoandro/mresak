import clsx from 'clsx';
import { LiHTMLAttributes } from 'react';
import { UserAttributes } from '~/db/models/users';
import Avatar from './Avatar';

interface UserListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  user: UserAttributes;
  oneLine?: boolean;
}

export default function UserListItem({ user, className, oneLine = false, ...props }: UserListItemProps) {
  if (oneLine) {
    return (
      <li className={clsx('flex px-3 py-2 flex items-center', className)} {...props}>
        <Avatar name={user.name} className="mr-2" />
        <span>{user.name}</span>
        <span className="text-gray-400 mx-2">&bull;</span>
        <span className="text-gray-500">@{user.login}</span>
      </li>
    );
  }
  return (
    <li className={clsx('flex px-3 py-2 flex items-center', className)} {...props}>
      <Avatar name={user.name} className="mr-2" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user.name}</span>
        <span className="text-gray-500 text-xs">@{user.login}</span>
      </div>
    </li >
  );
}
