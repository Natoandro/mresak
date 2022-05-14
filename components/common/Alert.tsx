import clsx from 'clsx';
import { HTMLAttributes, PropsWithChildren } from 'react';

export type AlertProps = PropsWithChildren<HTMLAttributes<HTMLDivElement> & {
  type: 'success' | 'info' | 'error';
  onClose?: () => void;
}>;

export default function Alert(
  { type, className, children, onClose, ...props }: AlertProps
) {
  return (
    <div className={clsx(
      getClassNames(type),
      'border rounded px-3 py-2 flex flex-col',
      className,
    )}>
      <div>
        {children}
      </div>
      {onClose && (
        <button
          className={clsx(getButtonClassNames(type), 'text-xs self-end mt-1')}
          onClick={() => onClose()}
        >
          Close
        </button>
      )}
    </div>
  );
}

function getClassNames(type: AlertProps['type']): string {
  switch (type) {
    case 'success':
      return 'bg-green-100 border-green-200 text-green-600';
    case 'info':
      return 'bg-blue-100 border-blue-200 text-blue-500';
    case 'error':
      return 'bg-red-100 border-red-200 text-red-500';
    default:
      return '';
  }
}

function getButtonClassNames(type: AlertProps['type']): string {
  switch (type) {
    case 'info':
      return 'text-blue-500';
    case 'success':
      return 'text-green-600';
    case 'error':
      return 'text-red-500';
    default:
      return '';
  }
}
