import { ADMIN_SESS_MAXAGE } from './consts';
import { Session } from './session';
import { RequestHandler } from './api/types';


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


export const requireUser: RequestHandler = (req, res, next) => {
  if (req.session?.userId != null) {
    next();
  } else {
    res.status(403).json({
      error: 'authentication required',
    });
  }
};
