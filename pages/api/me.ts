import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import db from '~/db/models';
import { requireUser } from '~/lib/authz';
import sessionMiddleware from '~/lib/session';
import { ApiRequest } from '~/lib/api/types';
import bcrypt from 'bcrypt';

interface PatchReqExt {
  body: {
    patch: 'password';
    from: string;
    to: string;
  };
}

const handler = nextConnect<ApiRequest, NextApiResponse>()
  .use(sessionMiddleware)
  .use(requireUser);

let dbSynced = false;

handler.get(async (req, res) => {
  if (!dbSynced) {
    console.log('Synchronizing database with model...');
    await db.sequelize.sync();
    console.log('Database synchronization complete.');
    dbSynced = true;
  }

  const currentUser = await db.users.findByPk(req.session!.userId);
  if (currentUser == null) {
    res.status(404).end();
  } else {
    res.status(200).json(currentUser.toJSON());
  }
});

handler.patch<PatchReqExt>(async (req, res) => {
  const userId = req.session.userId!;

  const { patch } = req.body;
  if (patch === 'password') {
    const { from, to } = req.body;
    const user = await db.users.findByPk(userId);

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

export default handler;
