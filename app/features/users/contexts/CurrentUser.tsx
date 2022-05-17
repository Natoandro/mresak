import axios from 'axios';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react';
import type { UserAttributes } from '~/db/models/users';

interface ContextValue {
  user: UserAttributes | null;
  setUser: Dispatch<SetStateAction<UserAttributes | null>>;
}

const CurrentUserContext = createContext<ContextValue>({
  user: null,
  setUser: () => { },
});

export default CurrentUserContext;

export function useCurrentUser() {
  return useContext(CurrentUserContext).user;
}

export function CurrentUserProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState<UserAttributes | null>(null);

  useEffect(() => {
    axios.get<UserAttributes>('/api/me')
      .then(res => setUser(res.data))
      .catch(err => { console.error(err); });
  }, [setUser]);

  return (
    <CurrentUserContext.Provider value={{ user, setUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
