import { Session } from './session';
import { RequestHandler } from './types';


const ADMIN_SESS_MAXAGE = 300000; // 5 minutes

export function checkAdmin(session: Session): boolean {
  const { adminSessionStart } = session;
  if (adminSessionStart) {
    if (Date.now() - adminSessionStart < ADMIN_SESS_MAXAGE) {
      return true;
    }
  }
  session.adminSessionStart = undefined;
  return false;
}

export const requireAdminMiddleware: RequestHandler = (req, res, next) => {
  if (checkAdmin(req.session)) {
    next();
  } else {
    res.status(403).json({
      'error': 'admin only',
    });
  }
};

