import { FocusEvent, forwardRef, HTMLAttributes, InputHTMLAttributes, ReactNode, useId, useState } from 'react';
import clsx from 'clsx';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  startIcon?: ReactNode | ((p: { focus: boolean; }) => ReactNode); // TODO: add hover
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

export default forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({
    label, error, helperText, startIcon, onFocus, onBlur, ...props
  }, ref) {
    const inputId = useId();

    const [hasFocus, setHasFocus] = useState<boolean>(false);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setHasFocus(true);
      onFocus?.(e);
    };
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setHasFocus(false);
      onBlur?.(e);
    };

    const renderedStartIcon = (() => {
      if (typeof startIcon === 'function') {
        return startIcon({ focus: hasFocus });
      } else {
        return startIcon;
      }
    })();

    return (
      <div className="flex flex-col mb-2">
        {(label != null) && (
          <label className="grow-0 my-2" htmlFor={inputId}>{label}</label>
        )}
        <div className={clsx(
          "rounded p-1 border outline-none border-2 flex items-center hover:border-blue-200",
          hasFocus && "border-blue-500 hover:border-blue-500",
          error && "border-red-500 hover:border-red-500 text-red-500",
        )}>
          {renderedStartIcon}
          <input
            ref={ref}
            id={inputId}
            className="grow mx-2 outline-none"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </div>
        {(helperText != null) && (
          <p className={clsx("text-xs mx-2 my-1 text-gray-500", error && "text-red-500")}>{helperText}</p>
        )}
      </div >
    );
  }
);
