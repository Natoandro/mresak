import { forwardRef, HTMLAttributes, RefObject, useState } from 'react';

interface MessageInputProps extends HTMLAttributes<HTMLDivElement> {
  onSend: (message: string) => void;
  inputRef?: RefObject<HTMLTextAreaElement>;
}

export default
  function MessageInput({ onSend, inputRef, ...props }: MessageInputProps) {
  const [message, setMessage] = useState('');

  return (
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
  );
}


function getShadowText(message: string) {
  if (message[message.length - 1] === '\n') {
    return message + 'X';
  } else {
    return message;
  }
}
