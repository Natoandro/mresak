import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import db from '~/db/models';
import { requireAdminMiddleware } from '~/lib/authz';
import sessionMiddleware from '~/lib/session';

interface PostReq {
  body: {
    login: string;
    name: string;
  };
}

export default nextConnect<NextApiRequest, NextApiResponse>()
  .use(sessionMiddleware)
  .use(requireAdminMiddleware)
  .get(async (req, res) => {
    const users = await db.users.findAll();
    res.json(users);
  })
  .post(async (req: PostReq, res) => {
    const { login, name } = req.body;
    db.users.create({ login, name, });
    res.end();
  });
