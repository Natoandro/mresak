import type { NextPage, GetServerSideProps } from 'next';
import { FieldErrors, useForm } from 'react-hook-form';
import FormField from '../components/common/FormField';

interface FieldValues {
  password: string;
  passwordConfirm: string;
}

// rendered on first run
const Index: NextPage = () => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FieldValues>();

  const onSubmit = (data: FieldValues) => console.log(data);

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
          <button className="grow text-white rounded bg-blue-600 py-1">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async () => {
  // TODO: check if user is
  return {
    props: {}
  };
};
