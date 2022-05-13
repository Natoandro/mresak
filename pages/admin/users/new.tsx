import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '~/components/admin/Layout';
import Button from '~/components/common/Button';
import FormField from '~/components/common/FormField';
import { checkAdmin } from '~/lib/authz';
import { getSession } from '~/lib/session';

interface FieldValues {
  login: string;
  name: string;
}

const NewUserPage: NextPage = () => {
  const router = useRouter();

  const { register, handleSubmit } = useForm<FieldValues>();

  const onSubmit = async (data: FieldValues) => {
    await axios.post('/api/admin/users', data);
    await router.push('/admin');
  };

  return (
    <Layout>
      <h3 className="text-3xl mt-6 mb-4">Create new user</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Login" autoFocus
          {...register('login', { required: true })}
        />
        <FormField
          label="Name"
          {...register('name', { required: true })}
        />

        <div className="flex mt-6">
          <Button className="w-20">Save</Button>
        </div>
      </form>
    </Layout>
  );
};

export default NewUserPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);

  if (!checkAdmin(session)) {
    return {
      // TODO: redirect url
      redirect: { destination: '/admin/login', permanent: false },
    };
  }

  return {
    props: {}
  };
};
