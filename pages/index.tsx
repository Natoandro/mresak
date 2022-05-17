import type { NextPage, GetServerSideProps } from 'next';
import db from '~/db/models';
import { UserAttributes } from '~/db/models/users';
import ssrCurrentUser from '~/lib/ssrCurrentUser';


interface HomePageProps {
  currentUser: UserAttributes;
}

const HomePage: NextPage<HomePageProps> = () => {
  return null;
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const admin = await db.admin.findOne();
  if (admin == null) {
    // first run
    return {
      redirect: {
        destination: '/admin/init',
        permanent: false,
      }
    };
  }

  const currentUser = await ssrCurrentUser(ctx);

  if (currentUser == null) {
    return {
      redirect: { destination: '/login', permanent: false, },
    };
  } else {
    // latest chat
    const chat = await db.chats.findLatestByMember(currentUser.id);
    console.log('latest chat', chat);
    if (chat == null) {
      return { notFound: true }; // TODO: new chat
    } else {
      return {
        redirect: {
          destination: `/chats/${chat.id}`,
          permanent: false
        },
      };
    }
  }
};
