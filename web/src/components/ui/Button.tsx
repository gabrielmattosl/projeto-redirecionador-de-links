import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans transition-colors focus-visible:outline-none disabled:cursor-not-allowed';

    const variants = {
      primary:
        'h-10 px-4 py-2 bg-blue-base hover:bg-blue-dark text-white font-semibold text-sm rounded disabled:opacity-50',
      secondary:
        'h-10 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 font-semibold text-sm rounded disabled:bg-white disabled:text-gray-300 disabled:border-gray-200',
      icon:
        'w-8 h-8 p-0 bg-transparent hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded disabled:text-gray-300 disabled:pointer-events-none',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
