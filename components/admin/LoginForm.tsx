import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import FormField from '../common/FormField';


interface FieldValues {
  password: string;
}

interface AdminLoginFormProps {
  onAuth: () => void;
}

export default function AdminLoginForm({ onAuth }: AdminLoginFormProps) {
  const { register, handleSubmit, watch } = useForm<FieldValues>();
  const password = watch('password', '');

  const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    try {
      await axios.post('/api/admin/login', data);
      onAuth();
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
          <Button disabled={password == ''}>Log In</Button>
        </div>
      </form>
    </div>
  );
};
