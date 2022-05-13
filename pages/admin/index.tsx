import { GetServerSideProps, NextPage } from 'next';
import Users from '~/components/admin/Users';
import { checkAdmin } from '~/lib/authz';
import { getSession, Session } from '~/lib/session';

const AdminPage: NextPage = () => {
  return (
    <Users />
  );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session: Session = await getSession(req, res);

  if (!checkAdmin(session)) {
    // not signed as admin
    return {
      redirect: { destination: '/admin/login', permanent: false },
    };
  }

  return {
    props: {}
  };
};
