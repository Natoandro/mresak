import { NextApiRequest, NextApiResponse } from 'next';
import nextSession from 'next-session';
import type { Session as NextSession } from 'next-session/lib/types';
import SessionStore from './session-store';
import db from '~/db/models';
import { NextHandler } from 'next-connect';

export interface SessionData {
  adminSessionStart?: number;
  username?: string;
}

export type Session = NextSession & SessionData;

export const getSession = nextSession({
  name: 'sid',
  store: new SessionStore(db.sessions),
  cookie: {
    httpOnly: true,
    sameSite: true,
    // maxAge: 300
  }
});

export interface ReqExt {
  session: Session;
}

export default async function sessionMiddleware(
  req: NextApiRequest & ReqExt, res: NextApiResponse, next: NextHandler
) {
  await getSession(req, res);
  next();
}

