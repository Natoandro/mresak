import { useEffect, useRef, useState } from 'react';
import { RUserAttributes } from '~/db/models/users';
import MessageInput from './MessageInput';

interface MessagesProps {
  currentUser: RUserAttributes;
  interlocutor: RUserAttributes; // the other member of the current thread
}

export default function Messages({ currentUser, interlocutor }: MessagesProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [interlocutor]);

  return (
    <div className="grow flex flex-col">
      <main className="grow">
        <p className="mt-8 text-3xl text-gray-300 text-center">No message</p>
      </main>
      <MessageInput onSend={() => { }} inputRef={inputRef} />
    </div>
  );
}
