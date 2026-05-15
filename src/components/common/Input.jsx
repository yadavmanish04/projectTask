import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

const Input = forwardRef(({ label, error, className, type, ...props }, ref) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={isPassword ? (show ? 'text' : 'password') : type}
          className={clsx(
            'input',
            isPassword && 'pr-10',
            error && 'border-rose-500 focus:ring-rose-500/30',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  );
});

export default Input;

