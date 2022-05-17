import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import db from '~/db/models';
import { requireUser } from '~/lib/authz';
import sessionMiddleware from '~/lib/session';
import { ApiRequest } from '~/lib/api/';
import { Op } from 'sequelize';


interface GetReqExt {
  query: {
    q: string;
  };
}

export default nextConnect<ApiRequest, NextApiResponse>()
  .use(sessionMiddleware)
  // .use(requireUser)

  .get<GetReqExt>(async (req, res) => {
    // TODO: exclude self

    const { q } = req.query;
    if (q.startsWith('@')) {
      const search = q.slice(1);
      const match = await db.users.findAll({ where: { login: { [Op.startsWith]: search } } });
      res.status(200).json(match.map(user => user.toJSON()));
    } else {
      const match = await db.users.findAll({ where: { name: { [Op.substring]: q } } });
      res.status(200).json(match.map(user => user.toJSON()));
    }
  });

