import { Fragment, HTMLAttributes, useEffect, useRef } from 'react';
import MessageView from './MessageView';
import MessageInput from './MessageInput';
import clsx from 'clsx';
import { useAppSelector } from '~/app/hooks';
import { selectChatState, selectMessageLoadingStatus } from '@/chats/chatsSlice';
import useFetchMessages from '../hooks/useFetchMessages';
import useActiveChatId from '../hooks/useActiveChatId';
import MessageSender from './MessageSender';

interface MessagesProps extends HTMLAttributes<HTMLDivElement> { }

export default function Messages({ className, ...props }: MessagesProps) {
  const activeChatId = useActiveChatId();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // TODO: const messagesAreReady = useAppSelector(...)
  // const allMessages = useAppSelector(s => selectAllMessages(s, activeChatId));
  // const isReady = allMessages != null;
  const isReady = useAppSelector(
    s => selectMessageLoadingStatus(s, activeChatId) === 'success'
  );

  useFetchMessages(activeChatId);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChatId]);

  // TODO: skeleton??
  return (
    <div className={clsx('flex flex-col', className)} {...props}>
      <main className="grow shrink overflow-y-auto flex flex-col space-y-2 py-2">
        <div className="grow" />
        {isReady && (
          <MessageList />
        )}
      </main>
      <MessageInput ref={inputRef} />
      {isReady && <MessageSender chatId={activeChatId} />}
    </div>
  );
}

function MessageList() {
  const chatId = useActiveChatId();
  const { messages, queue } = useAppSelector(s => selectChatState(s, chatId))!;
  return (
    <Fragment>
      {messages.map(msg => (
        <MessageView key={msg.id} message={msg} status="sent" />
      ))}
      {queue.map((msg, i, arr) => (
        <MessageView
          key={i} status="default"
          message={{ ...msg, id: i - arr.length, createdAt: 0 }}
        />
      ))}
    </Fragment>
  );
}
