import type { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import db from '~/db/models';
import { ApiRequest } from '~/lib/api/';
import bcrypt from 'bcrypt';
import sessionMiddleware from '~/lib/session';

const handler = nextConnect<ApiRequest, NextApiResponse>();

handler.use(sessionMiddleware);

interface PostReqExt {
  body: {
    login: string;
    password: string;
  };
}

handler.post<PostReqExt>(async (req, res) => {
  const { login, password } = req.body;
  const user = await db.users.findOne({ where: { login } });
  if (user == null) {
    res.status(404).end();
    return;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (ok) {
    const { passwordResetRequired } = user;
    req.session.userId = user.id;
    res.status(200).json({ passwordResetRequired });
  } else {
    res.status(403).json({
      error: 'invalid password'
    });
  }
});

export default handler;
