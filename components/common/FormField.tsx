import { FC, forwardRef, InputHTMLAttributes, useId } from 'react';
import clsx from 'clsx';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
}

export default forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, error, helperText, ...props }, ref) {
    const inputId = useId();;

    return (
      <div className="flex flex-col mb-2">
        {(label != null) && (
          <label className="grow-0 my-2" htmlFor={inputId}>{label}</label>
        )}
        <input
          ref={ref}
          className={clsx(
            "rounded px-2 py-1 border outline-none border-2",
            error ? "border-red-500 text-red-500" : "hover:border-blue-200 focus:border-blue-500"
          )}
          id={inputId}
          {...props}
        />
        {(helperText != null) && (
          <p className={clsx("text-xs mx-2 my-1", error && "text-red-500")}>{helperText}</p>
        )}
      </div >
    );
  }
);
