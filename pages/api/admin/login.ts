import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import db from '~/db/models';

interface PostReq {
  body: {
    password: string;
  };
}

export default nextConnect()
  .post<PostReq, NextApiResponse>(async (req, res) => {
    const admin = await db.admin.findOne();
    if (admin == null) {
      res.status(400).end();
    } else {
      console.dir(admin);
      const { passwordHash } = admin;
      const valid = await bcrypt.compare(req.body.password, passwordHash);
      if (valid) {
        res.status(200).json('ok');
      } else {
        res.status(403).json({
          error: 'invalid password'
        });
      }
    }
  });