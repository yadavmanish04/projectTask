import { forwardRef } from 'react';
import clsx from 'clsx';

const Select = forwardRef(({ label, error, children, className, ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
    <select ref={ref} className={clsx('input', className)} {...props}>{children}</select>
    {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
  </label>
));

export default Select;
