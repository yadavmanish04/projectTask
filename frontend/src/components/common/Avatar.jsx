import { initials } from '../../utils/format';
import clsx from 'clsx';

export default function Avatar({ user, size = 32, className }) {
  if (!user) return null;
  return user.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      style={{ width: size, height: size }}
      className={clsx('rounded-full object-cover', className)}
    />
  ) : (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={clsx(
        'flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-700/30 dark:text-brand-100',
        className
      )}
    >
      {initials(user.name)}
    </div>
  );
}
