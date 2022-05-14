import axios from 'axios';
import clsx from 'clsx';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import Layout from '~/components/admin/Layout';
import Button, { ButtonProps } from '~/components/common/Button';
import db from '~/db/models';
import { RUserAttributes } from '~/db/models/users';
import { checkAdmin } from '~/lib/authz';
import { toPlainObject } from '~/lib/model';
import { getSession } from '~/lib/session';

const ActionButton = ({ className, ...props }: ButtonProps) => (
  <Button variant="outlined" {...props} className={clsx(className, 'mx-2')} />
);

interface UserPageProps {
  user: RUserAttributes;
}

interface PasswordResetResult {
  password: string;
}

const UserPage: NextPage<UserPageProps> = ({ user }) => {
  const [newPassword, setNewPassword] = useState<string | null>(null);

  const onResetPassword = async () => {
    const res = await axios.patch<PasswordResetResult>(
      '/api/admin/users', { id: user.id, password: null }
    );
    setNewPassword(res.data.password);
  };

  return (
    <Layout className='flex flex-col py-4 items-center'>
      {newPassword && (
        <div className="p-2 border border-green-300 rounded-lg bg-green-100 text-gray-700 self-stretch flex flex-col mb-4">
          <p>
            Password has been successfully reset. New password is{' '}
            <code className="text-green-700 font-bold">{newPassword}</code>.
          </p>
          <button
            onClick={() => setNewPassword(null)}
            className="text-sm text-green-600 self-end"
          >Close</button>
        </div>
      )}
      <svg width={200} height={200} className="bg-slate-400 rounded-full inline mb-4"></svg><br />
      <p className="text-2xl">{user.name}</p>
      <p className="text-xl text-gray-500">@{user.login}</p>
      <div className="my-4">
        <ActionButton onClick={onResetPassword}>Reset password</ActionButton>
        <ActionButton>Delete account</ActionButton>
      </div>
    </Layout>
  );
};

export default UserPage;


interface RouteParams extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<UserPageProps, RouteParams> =
  async ({ req, res, params }) => {
    const session = await getSession(req, res);
    if (!checkAdmin(session)) {
      return {
        redirect: { destination: '/admin/login', permanent: false }
      };
    }

    const id = parseInt(params!.id, 10);
    const user = await db.users.findOne({ where: { id } });
    if (user == null) {
      return { notFound: true };
    }

    return {
      props: { user: toPlainObject(user) }
    };
  };
