import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '~/components/common/Button';
import FormField from '~/components/common/FormField';



interface FieldValues {
  login: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const router = useRouter();

  const { register, handleSubmit, watch } = useForm<FieldValues>();

  const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
  const onSubmit = async (data: FieldValues) => {
    try {
      await axios.post('/api/login', data);
    } catch (err) {
      setPasswordIsInvalid(true);
    }
    await router.replace('/');
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-4 border shadow-md rounded">
      <h1 className="text-3xl my-2">Log In</h1>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Handle" autoFocus
          {...register('login', { required: true })}
        />
        <FormField
          type="password"
          label="Password"
          {...register('password', { required: true, })}
        />

        <div className="flex mt-6">
          <Button className="grow">Log in</Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {}
  };
};