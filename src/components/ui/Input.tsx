import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 
              bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-dark-border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
              ${leftIcon ? 'pl-10' : ''}
              ${error ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
