import { forwardRef, HTMLAttributes, KeyboardEvent, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch } from '~/app/hooks';
import { useCurrentUser } from '../../users/contexts/CurrentUser';
import { enqueueMessage } from '../chatsSlice';
import useActiveChatId from '../hooks/useActiveChatId';

interface MessageInputRef {
  focus: () => void;
}

interface MessageInputProps extends HTMLAttributes<HTMLDivElement> { }

export default forwardRef<MessageInputRef, MessageInputProps>(
  function MessageInput(props, ref) {
    const dispatch = useAppDispatch();
    const user = useCurrentUser();
    const activeChatId = useActiveChatId();

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [message, setMessage] = useState('');

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    const handleSubmit = () => {
      dispatch(enqueueMessage({
        senderId: user!.id,
        chatId: activeChatId,
        text: message,
      }));
      setMessage('');
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.code === 'Enter' && !e.shiftKey) { // send
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <footer className="border-t border-gray-300 flex" {...props}>
        <div className="grow relative h-auto">
          <textarea
            placeholder="Message to XXXXX"
            className="resize-none outline-none px-2 py-1 text-gray-800 absolute w-full h-full"
            ref={inputRef} onKeyPress={handleKeyPress}
            value={message} onChange={e => setMessage(e.target.value)}
          />
          <div className="invisible px-2 py-1 w-full h-full max-h-60 whitespace-pre-wrap">
            {getShadowText(message) || 'Message to XXXXXX'}
          </div>
        </div>
        <button
          className="text-white bg-blue-500 self-center px-2 mx-2 rounded-full"
          onClick={handleSubmit}
        >
          Send
        </button>
      </footer>
    );
  }
);


function getShadowText(message: string) {
  if (message[message.length - 1] === '\n') {
    return message + 'X';
  } else {
    return message;
  }
};
