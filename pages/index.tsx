import axios from 'axios';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '~/components/chat/Layout';
import UserSearchDialog from '~/components/users/UserSearchDialog';
import db from '~/db/models';
import { getSession, Session } from '~/lib/session';
import FormField from '../components/common/FormField';

interface FieldValues {
  password: string;
  passwordConfirm: string;
}

const Home: NextPage = () => {
  const [userSearchIsOpen, setUserSearchIsOpen] = useState(false);

  return (
    <Layout
      actions={
        <Fragment>
          <button
            className="w-10 h-10 rounded-full hover:bg-blue-50 flex items-center justify-center opacity-80 hover:opacity-100 active:bg-blue-100"
            title="New message"
            onClick={() => setUserSearchIsOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="fill-blue-500">
              <path d="M0,24 h24 v-2 h-24 z M4,18h3l12,-12l-3,-3l-12,12z" />
            </svg>
          </button>
          <UserSearchDialog
            open={userSearchIsOpen} onClose={() => setUserSearchIsOpen(false)}
            title="Select recipient"
          />
        </Fragment>
      }
    >
      <p>Home</p>
    </Layout>
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
