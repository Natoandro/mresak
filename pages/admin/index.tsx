import axios from 'axios';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import db from '~/db/models';
import FormField from '~/components/common/FormField';
import Button from '~/components/common/Button';
import AdminLoginForm from '~/components/admin/LoginForm';
import { useState } from 'react';

// rendered on first run
const AdminIndex: NextPage = () => {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return (<AdminLoginForm onAuth={() => setAuthenticated(true)} />);
  }
  return <p>Admin</p>;
};

export default AdminIndex;

export const getServerSideProps: GetServerSideProps = async () => {
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
    props: {}
  };
};
