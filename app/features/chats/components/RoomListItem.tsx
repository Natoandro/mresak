import clsx from 'clsx';
import { HTMLAttributes, useMemo } from 'react';
import { ChatAttributes } from '~/db/models/chats';
import Avatar from '~/components/users/Avatar';
import { useAppSelector } from '~/app/hooks';
import { selectCurrentUser } from '@/users/userSlice';

export interface RoomListItemProps extends HTMLAttributes<HTMLLIElement> {
  chat: ChatAttributes;
  active: boolean;
}

export function RoomListItem({ chat, active, className, ...props }: RoomListItemProps) {
  const user = useAppSelector(selectCurrentUser)!;
  const { unseenMessageCount } = chat;

  const self = useMemo(() => (
    chat.members!.find(member => member.id === user.id)!
  ), [chat.members, user.id]);

  const otherMembers = useMemo(() => (
    chat.members!.filter(member => member.id !== user.id)
  ), [chat.members, user.id]);

  // TODO: what for more than two members
  const significantMember = otherMembers[0] ?? self;

  const renderPreview = () => {
    if (chat.latestMessage == null) {
      return <span className="text-gray-500 italic text-xs truncate">No messages yet.</span>;
    } else {
      const { text, senderId } = chat.latestMessage;
      return (
        <span className={clsx(
          'text-xs truncate text-gray-500',
          active || 'text-gray-500',
          // unseenMessageCount > 0 && 'font-bold'
        )}>
          {senderId === user.id && 'You: '}{text}
        </span>
      );
    }
  };

  return (
    <li
      className={clsx(
        'flex px-3 py-2 flex items-center select-none',
        unseenMessageCount > 0 && 'font-bold',
        className
      )}
      {...props}
    >
      <Avatar name={significantMember.name} className="mr-2 shrink-0 grow-0" />
      <div className="text-gray-800 flex flex-col overflow-hidden">
        <span className={clsx('text-sm truncate')}>
          {unseenMessageCount > 0 && `(${unseenMessageCount}) `}
          {otherMembers.map(mb => mb.name).join(', ')}
        </span>
        {renderPreview()}
      </div>
    </li >
  );
}
