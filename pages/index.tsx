import axios from 'axios';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import db from '~/db/models';
import { getSession, Session } from '~/lib/session';
import FormField from '../components/common/FormField';

interface FieldValues {
  password: string;
  passwordConfirm: string;
}

const Home: NextPage = () => {
  return (
    <p>Home</p>
  );
};

export default Home;

let dbSynced = false;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session: Session = await getSession(req, res);
  if (session.username) {
    // logged in
    // TODO: list chat threads
    return {
      props: {},
    };
  }

  if (!dbSynced) {
    await db.sequelize.sync();
    dbSynced = true;
  }

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

  return {
    redirect: { destination: '/login', permanent: false, },
  };
};
