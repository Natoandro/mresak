import clsx from 'clsx';
import { HTMLAttributes, useMemo } from 'react';
import { useCurrentUser } from '~/contexts/currentUser';
import { ChatAttributes } from '~/db/models/chats';
import Avatar from '~/components/users/Avatar';

export interface RoomListItemProps extends HTMLAttributes<HTMLLIElement> {
  chat: ChatAttributes;
}

export function RoomListItem({ chat, className, ...props }: RoomListItemProps) {
  const user = useCurrentUser();

  const self = useMemo(() => (
    chat.members!.find(member => member.id === user.id)!
  ), [chat.members, user.id]);

  const otherMembers = useMemo(() => (
    chat.members!.filter(member => member.id !== user.id)
  ), [chat.members, user.id]);

  // TODO: what for more than two members
  const significantMember = otherMembers[0] ?? self;

  return (
    <li className={clsx('flex px-3 py-2 flex items-center', className)} {...props}>
      <Avatar name={significantMember.name} className="mr-2 shrink-0 grow-0" />
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-normal truncate">
          {otherMembers.map(mb => mb.name).join(', ')}
        </span>
        <span className="text-gray-500 text-xs">No messages yet.</span>
      </div>
    </li >
  );
}
