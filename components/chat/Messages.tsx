import { useEffect, useRef, useState } from 'react';
import { RUserAttributes } from '~/db/models/users';

interface MessagesProps {
  currentUser: RUserAttributes;
  interlocutor: RUserAttributes; // the other member of the current thread
}

export default function Messages({ currentUser, interlocutor }: MessagesProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, [interlocutor]);

  return (
    <div className="grow flex flex-col">
      <main className="grow">
        <p className="mt-8 text-3xl text-gray-300 text-center">No message</p>
      </main>
      <footer className="border-t border-gray-300 flex">
        <div className="grow relative h-auto">
          <textarea
            placeholder="Message to XXXXX"
            className="resize-none outline-none px-2 py-1 text-gray-800 absolute w-full h-full"
            ref={inputRef}
            value={message} onChange={e => setMessage(e.target.value)}
          />
          <div className="invisible px-2 py-1 w-full h-full max-h-60 whitespace-pre-wrap">
            {getShadowText(message) || 'Message to XXXXXX'}
          </div>
        </div>
        <button className="text-white bg-blue-500 self-center px-2 mx-2 rounded-full">Send</button>
      </footer>
    </div>
  );
}

function getShadowText(message: string) {
  if (message[message.length - 1] === '\n') {
    return message + 'X';
  } else {
    return message;
  }
}
