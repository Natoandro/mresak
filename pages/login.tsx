import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { setUser } from '@/users/userSlice';
import { useAppDispatch } from '~/app/hooks';
import Button from '~/components/common/Button';
import FormCard from '~/components/common/FormCard';
import FormField from '~/components/common/FormField';
import { UserAttributes } from '~/db/models/users';
import { getSession, Session } from '~/lib/session';



interface FieldValues {
  login: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { register, handleSubmit, watch } = useForm<FieldValues>();
  const login = watch('login');
  const password = watch('password');

  const { next = '/' } = router.query as { next?: string; };

  // TODO: handle invalid password
  const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await axios.post<UserAttributes>('/api/login', data);
      dispatch(setUser(res.data));
      const { passwordResetRequired } = res.data;
      if (passwordResetRequired) {
        const usp = new URLSearchParams({ next });
        await router.replace(`/me/password-reset?${usp.toString()}`);
      } else {
        await router.replace(next);
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


export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const session: Session = await getSession(req, res);
  if (session.userId == null) {
    return {
      props: {}
    };
  }
  const { next = '/' } = query as { next?: string; };
  return {
    redirect: {
      destination: next,
      permanent: false,
    }
  };
};
