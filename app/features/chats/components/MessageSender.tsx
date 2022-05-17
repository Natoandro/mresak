import axios from 'axios';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { MessageMeta, messageSent, selectChatState, selectIsReady, setSendingStatus } from '../chatsSlice';

export interface MessageSenderProps {
  chatId: number;
}

export default function MessageSender({ chatId }: MessageSenderProps) {
  const isReady = useAppSelector(selectIsReady);
  if (!isReady) throw new Error('Mounted message sender on an unready state');

  const dispatch = useAppDispatch();

  //* the selected value cannot be null when `isReady` is true
  const { queue, sendingStatus } = useAppSelector(s => selectChatState(s, chatId))!;

  const queueFront = queue[0];
  useEffect(() => {
    if (sendingStatus === 'error') {
      // wait for 3 seconds then try again
      setTimeout(() => dispatch(setSendingStatus({ chatId: chatId, status: 'idle' })), 3000);
      return;
    }
    if (queueFront && sendingStatus === 'idle') {
      axios.post<MessageMeta>(`/api/chats/${chatId}/messages`, {
        text: queueFront.text
      })
        .then(res => dispatch(messageSent(res.data)))
        .catch(err => dispatch(setSendingStatus({ chatId: chatId, status: 'error' })));
    }
  }, [queueFront, sendingStatus, chatId, dispatch]);

  return null;
}