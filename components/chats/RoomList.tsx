import clsx from 'clsx';
import { useRouter } from 'next/router';
import { HTMLAttributes } from 'react';
import { selectChats } from '~/app/features/chats/chatsSlice';
import { useAppSelector } from '~/app/hooks';
import { RoomListItem } from './RoomListItem';

export interface RoomListProps extends HTMLAttributes<HTMLDivElement> {
  activeChatId: number;
}

export default function RoomList({ activeChatId, className, ...props }: RoomListProps) {
  const router = useRouter();
  const chats = useAppSelector(selectChats);

  const handleItemClick = (chatId: number) => {
    if (chatId !== activeChatId) {
      router.push(`/chats/${encodeURIComponent(chatId)}`);
    }
  };

  return (
    <div className={clsx('p-1 border-r border-gray-300 overflow-y-auto', className)} >
      {chats.map((chat) => (
        <RoomListItem
          key={chat.id} chat={chat}
          className={clsx(
            'hover:bg-slate-100 m-1 rounded-md cursor-default',
            chat.id === activeChatId && 'bg-violet-200 hover:bg-violet-200',
          )}
          onClick={() => handleItemClick(chat.id)}
        />
      ))}
    </div>
  );
};
