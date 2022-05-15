import { useEffect, useRef, useState } from 'react';
import { UserAttributes } from '~/db/models/users';
import MessageView from './MessageView';
import MessageInput from './MessageInput';

interface MessagesProps {
  currentUser: UserAttributes;
  interlocutor: UserAttributes; // the other member of the current thread
}


// TODO: move
export interface MessageAttributes {
  senderId: number;
  recipientId: number; //? Thread id
  text: string;
  sentAt: number;
  // seenAt: number;
}

export default function Messages({ currentUser, interlocutor }: MessagesProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<MessageAttributes[]>([]); // TODO: fetch

  const handleSend = (text: string) => {
    const msg: MessageAttributes = {
      senderId: currentUser.id,
      recipientId: interlocutor.id,
      sentAt: Date.now(),
      text,

    };

    setMessages(messages => [...messages, msg]);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [interlocutor]);

  return (
    <div className="grow flex flex-col">
      <main className="grow flex flex-col space-y-2 py-2">
        <div className="grow" />
        {messages.map(msg => (
          <MessageView key={getMessageId(msg)} message={msg} />
        ))}
      </main>
      <MessageInput onSend={handleSend} ref={inputRef} />
    </div>
  );
}

function getMessageId(msg: MessageAttributes) {
  return `${msg.senderId}--${msg.sentAt.toString(36)}`;
}
