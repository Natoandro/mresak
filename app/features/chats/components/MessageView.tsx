import clsx from 'clsx';
import { HTMLAttributes } from 'react';
import { MessageAttributes } from '~/db/models/messages';

export interface MessageDisplayProps extends HTMLAttributes<HTMLDivElement> {
  message: MessageAttributes;
}

export default function MessageView({ message, className, ...props }: MessageDisplayProps) {
  return (
    <div className={clsx('flex justify-end', className)} {...props}>
      <div className="w-20 grow" />
      <div className="grow-0 px-2 py-1 rounded-xl rounded-tr-none border bg-blue-500">
        <p className="whitespace-pre-wrap text-white">{message.text}</p>
      </div>
      <MessageStatusView status="default" className="mx-2 my-1 self-end shrink-0" />
    </div>
  );
}


type MessageStatus = 'default' | 'sent' | 'seen';

interface MessageStatusViewProps extends HTMLAttributes<HTMLDivElement> {
  status: MessageStatus;
}

function MessageStatusView({ status, className, ...props }: MessageStatusViewProps) {
  return (
    <div
      className={clsx(
        className,
        'w-3 h-3 border-2 rounded-full',
        getStatusStyle(status),
      )}
      {...props}
    />
  );
}

function getStatusStyle(status: MessageStatus) {
  switch (status) {
    case 'default': return 'border-slate-300';
    case 'sent': return 'border-slate-300 bg-slate-300';
    case 'seen': return 'border-blue-300 bg-blue-300';
  }
}

