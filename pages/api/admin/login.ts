import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import db from '~/db/models';
import sessionMiddleware, { ReqExt } from '~/lib/session';
import { ApiRequest } from '~/lib/types';
import { ADMIN_SESS_MAXAGE } from '~/lib/consts';

interface PostReqExt {
  body: {
    password: string;
  };
}

export default nextConnect<ApiRequest, NextApiResponse>()
  .use(sessionMiddleware)
  .post(async (req, res) => {
    const { adminSessionStart } = req.session;

    if (adminSessionStart && Date.now() - adminSessionStart < ADMIN_SESS_MAXAGE) {
      // valid session
      return res.status(409).json({
        error: 'active session',
      });
    }

    const admin = await db.admin.findOne();
    if (admin == null) {
      return res.status(409).json({
        error: 'init required',
      });
    }

    const { passwordHash } = admin;
    const valid = await bcrypt.compare(req.body.password, passwordHash);
    if (valid) {
      req.session.adminSessionStart = Date.now();
      res.status(200).json('ok');
    } else {
      res.status(403).json({
        error: 'invalid password'
      });

    }
  })
  .delete(async (req, res) => {
    req.session.adminSessionStart = undefined;
    res.status(200).json({});
  });
