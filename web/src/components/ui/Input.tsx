import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WarningCircle } from '@phosphor-icons/react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] uppercase tracking-[0.05em] text-gray-400 font-normal leading-[14px]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              'h-10 px-3 bg-white font-sans text-sm text-gray-600 rounded border border-gray-200 placeholder:text-gray-300 focus:outline-none focus:border-[1.5px] focus:border-blue-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors',
              error && 'border-danger focus:border-danger',
              className
            )
          )}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-1 mt-1 text-danger text-xs font-normal leading-[16px]">
            <WarningCircle size={12} weight="bold" className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
