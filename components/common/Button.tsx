import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from 'react';

interface BaseButtonProps {
  variant?: 'contained' | 'outlined';
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseButtonProps { }

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

interface ButtonLinkProps
  extends
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
  BaseButtonProps,
  Omit<LinkProps, 'onClick' | 'onMouseEnter'> { }

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink({ variant = 'contained', className, href, ...props }, ref) {
    return (
      <Link href={href}>
        <a
          className={clsx(getClassNames(variant), className, 'cursor-pointer')}
          {...props}
          ref={ref}
        />
      </Link>
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
