import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined';
}

export default forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'contained', className, ...props }, ref) {
    return (
      <button
        className={clsx(
          'grow text-white rounded bg-blue-600 py-1',
          'hover:bg-blue-700',
          'disabled:bg-blue-300',
          className
        )}
        {...props}
        ref={ref}
      />
    );
  }
);
