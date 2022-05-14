import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import db from '~/db/models';
import { requireAdminMiddleware } from '~/lib/authz';
import { genRandomPassword } from '~/lib/password';
import sessionMiddleware from '~/lib/session';

interface PostReq {
  body: {
    login: string;
    name: string;
  };
}

interface PatchReq {
  body: {
    id: number;
    password: null;
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
    const { password, hash } = await genRandomPassword();
    const user = await db.users.create({ login, name, passwordHash: hash, passwordResetRequired: true });
    res.status(201).json({ id: user.id, password });
  })
  .patch(async (req: PatchReq, res) => {
    if (req.body.password === null) { // reset password 
      const { id } = req.body;
      const { password, hash } = await genRandomPassword();
      await db.users.update({ passwordHash: hash, passwordResetRequired: true }, { where: { id } });
      res.status(200).json({ password });
    } else {
      res.status(400).json({});
    }
  });
