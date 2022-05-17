import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import db from '~/db/models';
import { Chat } from '~/db/models/chats';
import { requireUser } from '~/lib/authz';
import sessionMiddleware from '~/lib/session';
import { ApiRequest } from '~/lib/api/types';

const handler = nextConnect<ApiRequest, NextApiResponse>().use(sessionMiddleware, requireUser);

// TODO: limit
handler.get(async (req, res) => {
  const chats = await db.chats.findAllByMember(req.session.userId!);
  res.status(200).json(chats);
});

interface PostReqExt {
  body: {
    title?: string;
    memberIds: number[];
  };
}

handler.post<PostReqExt>(async (req, res) => {
  const memberIds = [req.session.userId!, ...req.body.memberIds];
  const chat = await db.chats.createWithMembers(req.body.title, memberIds);
  res.status(201).json(chat.toJSON());
});

export default handler;
