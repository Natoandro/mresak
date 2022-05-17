import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CurrentUserContext from '~/app/features/users/contexts/CurrentUser';
import Button from '~/components/common/Button';
import FormCard from '~/components/common/FormCard';
import FormField from '~/components/common/FormField';
import { UserAttributes } from '~/db/models/users';



interface FieldValues {
  login: string;
  password: string;
}

interface LoginResult {
  passwordResetRequired: boolean;
}

const LoginPage: NextPage = () => {
  const router = useRouter();

  const { register, handleSubmit, watch } = useForm<FieldValues>();
  const login = watch('login');
  const password = watch('password');

  const { setUser } = useContext(CurrentUserContext);

  // TODO: handle invalid password
  const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await axios.post<UserAttributes>('/api/login', data);
      setUser(res.data);
      const { passwordResetRequired } = res.data;
      if (passwordResetRequired) {
        await router.replace('/me/password-reset');
      } else {
        await router.replace('/');
      }
    } catch (err) {
      setPasswordIsInvalid(true);
    }
  };

  const getHelperText = () => {
    if (!passwordIsInvalid) return;
    return 'Password is invalid.';
  };

  useEffect(() => {
    setPasswordIsInvalid(false);
  }, [password, setPasswordIsInvalid]);

  return (
    <FormCard>
      <h1 className="text-3xl my-2">Log In</h1>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Handle" autoFocus
          {...register('login', { required: true })}
        />
        <FormField
          type="password"
          label="Password"
          error={passwordIsInvalid}
          helperText={getHelperText()}
          {...register('password', { required: true, })}
        />

        <div className="flex mt-6">
          <Button className="grow" disabled={!password || !login}>Log in</Button>
        </div>
      </form>
    </FormCard>
  );
};

export default LoginPage;


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {}
  };
};
