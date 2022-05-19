import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import type { ParsedUrlQuery } from 'querystring';
import db from '~/db/models';
import { ApiRequest } from '~/lib/api/types';
import { requireUser } from '~/lib/authz';
import sessionMiddleware from '~/lib/session';

const handler = nextConnect<ApiRequest, NextApiResponse>()
  .use(sessionMiddleware)
  .use(requireUser);

interface Query extends ParsedUrlQuery {
  since: string;
}
interface ParsedQuery {
  since: Date;
}

const parseQuery = ({ since }: Query): ParsedQuery => ({
  since: new Date(Number(since)),
});

interface ReqExt {
  query: Query;
}

handler.get<ReqExt>(async (req, res) => {
  const userId = req.session.userId!;
  const { since } = parseQuery(req.query);
  const messages = await db.messages.findAllByUser(userId, { since });

  res.status(200).json({ messages });
});

export default handler;
