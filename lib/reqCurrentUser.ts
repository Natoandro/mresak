import type { IncomingMessage } from 'http';
import { UserAttributes } from '~/db/models/users';

interface Request extends IncomingMessage {
  currentUser: UserAttributes | null;
}

export function setCurrentUser(req: IncomingMessage, currentUser: UserAttributes | null) {
  (req as Request).currentUser = currentUser;
}

export function getCurrentUser(req: IncomingMessage) {
  return (req as Request).currentUser ?? null;
}
