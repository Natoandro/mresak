import clsx from 'clsx';
import { Fragment, HTMLAttributes } from 'react';
import { useAppSelector } from '~/app/hooks';
import { MessageAttributes } from '~/db/models/messages';
import { selectCurrentUser } from '@/users/userSlice';

type MessageStatus = 'default' | 'sent' | 'seen';

export interface MessageViewProps extends HTMLAttributes<HTMLDivElement> {
  message: MessageAttributes;
  status: MessageStatus;
}

function MessageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('flex px-2', className)} {...props} />
  );
}

export default function MessageView({ message, status, ...props }: MessageViewProps) {
  const user = useAppSelector(selectCurrentUser)!;
  const sentByOther = message.senderId !== user.id;

  const spacer = <div className="w-20 grow" />;
  const boxClasses = "grow-0 px-2 py-1 rounded-xl";

  if (sentByOther) {
    return (
      <MessageContainer {...props}>
        <div className={clsx(boxClasses, 'rounded-tl-none bg-gray-200')}>
          <p className="whitespace-pre-wrap text-gray-800">{message.text}</p>
        </div>
        {spacer}
      </MessageContainer>
    );
  } else {
    return (
      <MessageContainer {...props}>
        {spacer}
        <div className={clsx(boxClasses, 'rounded-tr-none bg-blue-500')}>
          <p className="whitespace-pre-wrap text-white">{message.text}</p>
        </div>
        <MessageStatusView status={status} className="ml-2 my-1 self-end shrink-0" />
      </MessageContainer>
    );
  }

}



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

