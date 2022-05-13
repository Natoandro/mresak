import { RequestHandler } from './types';


const ADMIN_SESS_MAXAGE = 300000; // 5 minutes

export const requireAdmin: RequestHandler = (req, res, next) => {
  console.log(req.session);
  const { adminSessionStart } = req.session;
  if (adminSessionStart) {
    if (Date.now() - adminSessionStart < ADMIN_SESS_MAXAGE) {
      next();
      return;
    }
  }

  res.status(403).json({
    'error': 'admin only',
  });
};
