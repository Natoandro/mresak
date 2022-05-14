import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import db from '~/db/models';
import { requireUser } from '~/lib/authz';
import sessionMiddleware from '~/lib/session';
import { ApiRequest } from '~/lib/types';
import bcrypt from 'bcrypt';

interface PatchReqExt {
  body: {
    patch: 'password';
    from: string;
    to: string;
  };
}

export default nextConnect<ApiRequest, NextApiResponse>()
  .use(sessionMiddleware)
  .use(requireUser)

  .patch<PatchReqExt>(async (req, res) => {
    const username = req.session.username;

    const { patch } = req.body;
    if (patch === 'password') {
      const { from, to } = req.body;
      const user = await db.users.findOne({ where: { login: username } });

      const ok = await bcrypt.compare(from, user!.passwordHash);
      if (!ok) {
        res.status(409).json({ error: 'invalid password' });
        return;
      }

      const passwordHash = await bcrypt.hash(to, 10);

      await db.users.update({
        passwordHash,
        passwordResetRequired: false
      }, { where: { id: user!.id } });

      res.status(200).json({});
      return;
    }

    res.status(400).json({});
  });
