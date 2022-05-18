import axios from 'axios';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { messagesSeen, selectChat } from '../chatsSlice';
import useActiveChatId from './useActiveChatId';

export default function useSetSeen() {
  const dispatch = useAppDispatch();
  const activeChatId = useActiveChatId();
  const chat = useAppSelector(s => selectChat(s, activeChatId));

  const unseenMessageCount = chat?.unseenMessageCount;
  useEffect(() => {
    if (unseenMessageCount) {
      dispatch(messagesSeen(activeChatId));
      axios.patch(`/api/chats/${activeChatId}/messages`, {
        type: 'seen'
      });
    }
  }, [unseenMessageCount, dispatch, activeChatId]);
}