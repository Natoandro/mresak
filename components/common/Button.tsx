import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from 'react';


const baseClasses = 'rounded px-4 py-1';

interface BaseButtonProps {
  variant?: 'contained' | 'outlined';
  white?: boolean;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseButtonProps { }

export default forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'contained', white = false, className, ...props }, ref) {
    return (
      <button
        className={clsx(baseClasses, getClassNames({ variant, white }), className)}
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
  function ButtonLink({ variant = 'contained', white = false, className, href, ...props }, ref) {
    return (
      <Link href={href}>
        <a
          className={clsx(baseClasses, getClassNames({ variant, white }), className, 'cursor-pointer')}
          {...props}
          ref={ref}
        />
      </Link>
    );
  }
);


function getClassNames({ variant, white }: Required<BaseButtonProps>) {
  if (!white) {
    switch (variant) {
      case 'contained':
        return 'text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300';
      case 'outlined':
        return 'text-blue-600 hover:bg-blue-50 disabled:text-blue-300 border border-blue-300';
      default:
        return '';
    }
  } else {
    switch (variant) {
      case 'contained':
        return '';
      case 'outlined':
        return 'text-white opacity-80 border border-blue-300 disabled:opacity-40 hover:opacity-100';
    }
  }
}
