import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined';
}

export default forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'contained', className, ...props }, ref) {
    return (
      <button
        className={clsx(getClassNames(variant), className)}
        {...props}
        ref={ref}
      />
    );
  }
);

function getClassNames(variant: 'contained' | 'outlined') {
  switch (variant) {
    case 'contained':
      return 'text-white rounded bg-blue-600 px-4 py-1 hover:bg-blue-700 disabled:bg-blue-300';
    case 'outlined':
      return 'text-blue-600 rounded px-4 py-1 hover:bg-blue-50 disabled:text-blue-300 border border-blue-300';
    default:
      return '';
  }

}
