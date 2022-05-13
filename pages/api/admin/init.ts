import nextConnect from 'next-connect';
import bcrypt from 'bcrypt';
import db from '~/db/models';

interface InitBody {
  password: string;
}

export default nextConnect()
  .post<{ body: InitBody; }>(async (req, res) => {
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    db.admin.create({ passwordHash });
    res.end();
  });
