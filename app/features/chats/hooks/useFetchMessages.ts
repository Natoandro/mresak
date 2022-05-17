import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { selectMessageLoadingStatus } from '../chatsSlice';
import fetchMessages from '../fetchMessages';

export default function useFetchMessages(chatId: number) {
  const dispatch = useAppDispatch();
  const loadingStatus = useAppSelector((s) => selectMessageLoadingStatus(s, chatId));

  const ref = useRef<typeof loadingStatus | null>(null);

  useEffect(() => {
    //! There is a bug somewhere that calls this effect twice... Hydration??
    if (ref.current === loadingStatus) return;
    ref.current = loadingStatus;
    switch (loadingStatus) {
      case 'idle':
        console.log('---- DISPATCH -----', chatId);
        dispatch(fetchMessages(chatId));
        break;
      case 'error':
        // retry again in 3s
        setTimeout(() => {
          dispatch(fetchMessages(chatId));
        }, 3000);
        break;
    }
  }, [loadingStatus, chatId, dispatch]);
}
