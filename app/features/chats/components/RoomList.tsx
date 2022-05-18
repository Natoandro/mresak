import clsx from 'clsx';
import { useRouter } from 'next/router';
import { HTMLAttributes } from 'react';
import { selectIsReady, selectChats } from '~/app/features/chats/chatsSlice';
import { useAppSelector } from '~/app/hooks';
import { selectCurrentUser } from '@/users/userSlice';
import useActiveChatId from '../hooks/useActiveChatId';
import { RoomListItem } from './RoomListItem';

export interface RoomListProps extends HTMLAttributes<HTMLDivElement> { }

export default function RoomList({ className, ...props }: RoomListProps) {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const activeChatId = useActiveChatId();
  //* room list items requires user to be not null
  const isReady = useAppSelector(selectIsReady) && user != null;
  const chats = useAppSelector(selectChats);

  const handleItemClick = (chatId: number) => {
    if (chatId !== activeChatId) {
      router.push(`/chats/${encodeURIComponent(chatId)}`);
    }
  };

  // TODO: skeleton
  return (
    <div className={clsx('p-1 border-r border-gray-300 overflow-y-auto', className)} {...props}>
      {isReady && chats.map((chat) => (
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
