import axios from 'axios';
import { NextPage } from 'next';
import { useState } from 'react';
import { Field, useForm } from 'react-hook-form';
import Alert from '~/components/common/Alert';
import Button from '~/components/common/Button';
import FormCard from '~/components/common/FormCard';
import FormField from '~/components/common/FormField';

interface FieldValues {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const PasswordResetPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({ mode: 'onChange' });
  const password = watch('newPassword');

  const [message, setMessage] = useState<'success' | 'error' | null>(null);

  const onSubmit = async (data: FieldValues) => {
    const { newPassword, currentPassword } = data;
    try {
      await axios.patch('/api/me', {
        patch: 'password',
        from: currentPassword,
        to: newPassword,
      });
      setMessage('success');
    } catch (err) {
      console.error(err);
      setMessage('error');
    }
  };

  const getConfirmHelperText = () => {
    const error = errors.newPasswordConfirm;
    if (error?.type === 'match') return 'Passwords do not match';
    return 'Must match new password';
  };

  return (
    <FormCard>
      <h1 className="text-3xl my-2">Reset password</h1>

      {renderMessage(message, () => setMessage(null))}

      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          type="password" label="Current password" autoFocus
          {...register('currentPassword', { required: true })}
        />
        <FormField
          type="password" label="New password"
          {...register('newPassword', { required: true })}
        />
        <FormField
          type="password" label="Confirm new password"
          error={errors.newPasswordConfirm != null}
          helperText={getConfirmHelperText()}
          {...register('newPasswordConfirm', {
            required: true,
            validate: {
              match: (conf: string) => conf === password
            }
          })}
        />

        <div className="flex mt-6">
          <Button className="grow">Reset password</Button>
        </div>
      </form>
    </FormCard>
  );
};

export default PasswordResetPage;


function renderMessage(message: 'success' | 'error' | null, onClose: () => void) {
  const className = 'my-4';
  switch (message) {
    case 'success':
      return (
        <Alert type="success" className={className} onClose={onClose}>
          Your password has been successfully reset.
        </Alert>
      );
    case 'error':
      return (
        <Alert type="error" className={className} onClose={onClose}>
          An error occurred while resetting your password. Please try again.
        </Alert>
      );
    default:
      return null;
  }
}

