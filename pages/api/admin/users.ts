import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import db from '~/db/models';
import { requireAdminMiddleware } from '~/lib/authz';
import sessionMiddleware from '~/lib/session';

export default nextConnect<NextApiRequest, NextApiResponse>()
  .use(sessionMiddleware)
  .use(requireAdminMiddleware)
  .get(async (req, res) => {
    const users = await db.users.findAll();
    users.push(db.users.build({ login: 'natoandro', name: 'Natoandro' }));
    users.push(db.users.build({ login: 'peter', name: 'Peter Parker' }));
    res.json(users);
  });

