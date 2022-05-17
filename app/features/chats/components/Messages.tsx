import { HTMLAttributes, useEffect, useMemo, useRef } from 'react';
import MessageView from './MessageView';
import MessageInput from './MessageInput';
import clsx from 'clsx';
import { ChatAttributes } from '~/db/models/chats';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { enqueueMessage, MessageMeta, messageSent, selectAllMessages, selectChat, selectChatState, selectIsReady, SendingStatus, setSendingStatus } from '~/app/features/chats/chatsSlice';
import axios from 'axios';
import { MessageAttributes } from '~/db/models/messages';
import useFetchMessages from '../hooks/useFetchMessages';
import { useCurrentUser } from '../../users/contexts/CurrentUser';
import useActiveChatId from '../hooks/useActiveChatId';
import MessageSender from './MessageSender';

interface MessagesProps extends HTMLAttributes<HTMLDivElement> { }

export default function Messages({ className, ...props }: MessagesProps) {
  const activeChatId = useActiveChatId();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // TODO: const messagesAreReady = useAppSelector(...)
  const allMessages = useAppSelector(s => selectAllMessages(s, activeChatId));
  const isReady = allMessages != null;
  // const isReady = useAppSelector(selectIsReady);

  useFetchMessages(activeChatId);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChatId]);

  // TODO: skeleton??
  return (
    <div className={clsx('flex flex-col', className)} {...props}>
      <main className="grow flex flex-col space-y-2 py-2">
        <div className="grow" />
        {isReady && allMessages.map(msg => (
          <MessageView key={msg.id} message={msg} />
        ))}
      </main>
      <MessageInput ref={inputRef} />
      {isReady && <MessageSender chatId={activeChatId} />}
    </div>
  );
}
