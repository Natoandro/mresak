import { useEffect } from 'react';
import { useAppDispatch } from '~/app/hooks';
import fetchChatRooms from '../fetchChatRooms';

// TODO: progressive loading

export default function useFetchChatRooms() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);
}
