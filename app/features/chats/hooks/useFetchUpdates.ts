import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { selectIsReady, selectUpdatesStatus } from '../chatsSlice';
import fetchUpdates from '../fetchUpdates';

export default function useFetchUpdates() {
  const dispatch = useAppDispatch();
  const isReady = useAppSelector(selectIsReady);
  const status = useAppSelector(selectUpdatesStatus);
  useEffect(() => {
    if (!isReady) return;
    if (status !== 'pending') {
      setTimeout(() => dispatch(fetchUpdates(0)), 1000);
    }
  }, [isReady, status, dispatch]);
}
