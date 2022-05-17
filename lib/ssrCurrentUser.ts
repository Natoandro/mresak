import { GetServerSidePropsContext } from 'next';
import db from '~/db/models';
import { getCurrentUser } from './reqCurrentUser';
import { getSession } from './session';

const ssrCurrentUser = async ({ req, res }: GetServerSidePropsContext) => {
  let currentUser = getCurrentUser(req); // first load??
  if (!currentUser) {
    console.log('Oooops');
    // check again
    const session = await getSession(req, res);
    if (session.userId != null) {
      currentUser = (await db.users.findByPk(session.userId))?.toJSON() ?? null;
      if (currentUser == null) {
        // invalid userId: end current session
        delete session.userId;
      }
    }
  } else {
    console.log('---------------------');
  }

  return currentUser;
};

export default ssrCurrentUser;
