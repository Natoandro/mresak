import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { Op } from 'sequelize';
import db from '~/db/models';
import { ApiRequest } from '~/lib/api/types';
import { requireUser } from '~/lib/authz';
import sessionMiddleware from '~/lib/session';

interface Query {
  chatId: string;
}

const handler = nextConnect<ApiRequest, NextApiResponse>()
  .use(sessionMiddleware)
  .use(requireUser);

interface GetQuery {
  chatId: string;
  priorTo?: string;
}

interface GetReqExt {
  query: GetQuery;
}

const parseGetQuery = (query: GetQuery) => ({
  chatId: parseInt(query.chatId, 10),
  priorTo: query.priorTo === undefined ? undefined : new Date(parseInt(query.priorTo, 10)),
});

handler.get<GetReqExt>(async (req, res) => {
  const { chatId, priorTo } = parseGetQuery(req.query);
  const messages = await db.messages.findInChat(chatId, { priorTo });

  res.status(200).json(messages.map(msg => msg.toJSON()));
});

interface PostQuery {
  chatId: string;
}

const parsePostQuery = (q: PostQuery) => ({
  chatId: parseInt(q.chatId, 10),
});

interface PostReqExt {
  query: Query;
  body: {
    text: string;
  };
}

handler.post<PostReqExt>(async (req, res) => {
  const { chatId } = parsePostQuery(req.query);
  const senderId = req.session.userId!;
  const { text } = req.body;

  const msg = await db.sequelize.transaction(async (transaction) => {
    const msg = await db.messages.create({ chatId, senderId, text }, {
      transaction
    });
    await db.chatMembers.update({ latestSeen: msg.createdAt }, {
      where: { chatId, userId: senderId },
      transaction
    });
    return msg;
  });

  res.status(200).json({
    id: msg.id,
    chatId,
    createdAt: Number(msg.createdAt),
  });
});

interface PatchReqExt {
  query: Query;
  body: {
    type: 'seen';
  };
}

handler.patch<PatchReqExt>(async (req, res) => {
  const { chatId } = parsePostQuery(req.query);
  if (req.body.type === 'seen') {
    await db.chatMembers.update({
      latestSeen: new Date(),
    }, {
      where: {
        chatId, userId: req.session.userId!,
      }
    });
  }
});

export default handler;
