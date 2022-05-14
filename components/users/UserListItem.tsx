import clsx from 'clsx';
import { LiHTMLAttributes } from 'react';
import { RUserAttributes } from '~/db/models/users';

interface UserListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  user: RUserAttributes;
}

export default function UserListItem({ user, className, ...props }: UserListItemProps) {
  return (
    <li className={clsx('flex px-4 py-2 flex flex-col', className)} {...props}>
      <span>{user.name}</span>
      <span className="text-gray-500 text-sm">@{user.login}</span>
    </li>
  );
}
