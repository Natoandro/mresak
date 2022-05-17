import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { UserAttributes } from '~/db/models/users';

interface ContextValue {
  user: UserAttributes | null;
  setUser: Dispatch<SetStateAction<UserAttributes | null>>;
}

const CurrentUserContext = createContext<ContextValue>({} as ContextValue);

export default CurrentUserContext;

export function useCurrentUser() {
  return useContext(CurrentUserContext).user!;
}
