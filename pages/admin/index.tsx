import { GetServerSideProps, NextPage } from 'next';
import Users from '~/components/admin/Users';
import { getSession, Session } from '~/lib/session';

const AdminPage: NextPage = () => {
  return (
    <Users />
  );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session: Session = await getSession(req, res);
  if (session.adminSessionStart == null) {
    // not signed as admin
    return {
      redirect: { destination: '/admin/login', permanent: false },
    };
  }

  return {
    props: {}
  };
};
