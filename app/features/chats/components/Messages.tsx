import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import MessageView from './MessageView';
import MessageInput from './MessageInput';
import { useCurrentUser } from '~/contexts/currentUser';
import clsx from 'clsx';
import { ChatAttributes } from '~/db/models/chats';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { enqueueMessage, MessageMeta, messageSent, selectChatState, SendingStatus, setSendingStatus } from '~/app/features/chats/chatsSlice';
import axios from 'axios';
import { MessageAttributes } from '~/db/models/messages';
import useFetchMessages from '../hooks/useFetchMessages';

interface MessagesProps extends HTMLAttributes<HTMLDivElement> {
  chat: ChatAttributes;
}

export default function Messages({ chat, className, ...props }: MessagesProps) {
  const user = useCurrentUser();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useAppDispatch();
  const { messages, queue, sendingStatus } = useAppSelector(
    s => selectChatState(s, chat.id)!
  );

  const queueFront = queue[0];
  useEffect(() => {
    if (sendingStatus === 'error') {
      // wait for 3 seconds then try again
      setTimeout(() => dispatch(setSendingStatus({ chatId: chat.id, status: 'idle' })), 3000);
      return;
    }
    if (queueFront && sendingStatus === 'idle') {
      axios.post<MessageMeta>(`/api/chats/${chat.id}/messages`, {
        text: queueFront.text
      })
        .then(res => dispatch(messageSent(res.data)))
        .catch(err => dispatch(setSendingStatus({ chatId: chat.id, status: 'error' })));
    }
  }, [queueFront, sendingStatus, chat.id, dispatch]);

  // TODO: selector!!
  const allMessages = useMemo(() => [
    ...messages,
    ...queue.map((msg, i, arr) => ({
      ...msg, id: i - arr.length, createdAt: Date.now(),
    } as MessageAttributes))
  ], [messages, queue]);

  useFetchMessages(chat.id);

  const handleSend = (text: string) => {
    dispatch(enqueueMessage({
      senderId: user.id,
      chatId: chat.id,
      text,
    }));
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [chat.id]);

  return (
    <div className={clsx('flex flex-col', className)} {...props}>
      <main className="grow flex flex-col space-y-2 py-2">
        <div className="grow" />
        {allMessages.map(msg => (
          <MessageView key={msg.id} message={msg} />
        ))}
      </main>
      <MessageInput onSend={handleSend} ref={inputRef} />
    </div>
  );
}
