import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import db from '~/db/models';

export default nextConnect<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const users = await db.users.findAll();
    users.push(db.users.build({ login: 'natoandro', name: 'Natoandro' }));
    users.push(db.users.build({ login: 'peter', name: 'Peter Parker' }));
    res.json(users);
  });

