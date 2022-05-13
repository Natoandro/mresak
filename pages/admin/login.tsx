import axios from 'axios';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import db from '~/db/models';
import FormField from '~/components/common/FormField';
import Button from '~/components/common/Button';
import { useState } from 'react';
import { getSession, Session } from '~/lib/session';


interface FieldValues {
  password: string;
}

const AdminLogin: NextPage = () => {
  const router = useRouter();

  const { register, handleSubmit, watch } = useForm<FieldValues>();
  const password = watch('password', '');

  const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    try {
      await axios.post('/api/admin/login', data);
      await router.replace('/admin');
    } catch (err) {
      setPasswordIsInvalid(true);
    }
  };

  const getHelperText = () => {
    if (!passwordIsInvalid) return;
    return 'Password is invalid.';
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-4 border shadow-md rounded">
      <h1 className="text-3xl my-2">Log In as Admin</h1>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          type="password" autoFocus
          label="Password"
          error={passwordIsInvalid}
          helperText={getHelperText()}
          {...register('password', { required: true })}
        />

        <div className="flex mt-6">
          <Button className="grow" disabled={password == ''}>Log In</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session: Session = await getSession(req, res);

  // signed in as admin
  if (session.adminSessionStart != null) {
    return {
      redirect: { destination: '/admin', permanent: false, },
    };
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

  // not first run --> login page
  return {
    props: {}
  };
};
