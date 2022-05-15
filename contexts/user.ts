import { createContext } from 'react';
import { UserAttributes } from '~/db/models/users';

interface ContextValue {
  user: UserAttributes;
}

const UserContext = createContext<ContextValue>({} as ContextValue);

export default UserContext;
