import axios from 'axios';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import db from '~/db/models';
import FormField from '~/components/common/FormField';
import Button from '~/components/common/Button';

interface FieldValues {
  password: string;
  passwordConfirm: string;
}

// rendered on first run
const AdminInit: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FieldValues>();

  const onSubmit = async (data: FieldValues) => {
    const { password } = data;
    await axios.post('/api/admin/init', { password });
    await router.replace('/');
  };

  const getConfirmHelperText = () => {
    const error = errors.passwordConfirm;
    if (error == null) return;
    if (error.type === "match") {
      return "Passwords do not match";
    }
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-4 border shadow-md rounded">
      <h1 className="text-3xl my-2">Create admin password</h1>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          type="password" autoFocus
          label="Password"
          {...register('password', { required: true })}
        />
        <FormField
          type="password"
          label="Confirm password"
          {...register('passwordConfirm', {
            required: true,
            validate: {
              match: (conf: string) => conf === getValues('password')
            }
          })}
          error={!!errors.passwordConfirm}
          helperText={getConfirmHelperText()}
        />

        <div className="flex mt-6">
          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminInit;

let dbSynced = false;

export const getServerSideProps: GetServerSideProps = async () => {
  const admin = await db.admin.findOne();

  if (admin != null) {
    // not first run
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    };
  }

  return {
    props: {}
  };
};
