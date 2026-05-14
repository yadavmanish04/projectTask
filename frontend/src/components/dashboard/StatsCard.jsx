import clsx from 'clsx';

export default function StatsCard({ icon: Icon, label, value, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-100 text-brand-700 dark:bg-brand-700/30 dark:text-brand-100',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-700/30 dark:text-emerald-100',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-700/30 dark:text-amber-100',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-700/30 dark:text-rose-100',
    sky: 'bg-sky-100 text-sky-700 dark:bg-sky-700/30 dark:text-sky-100',
  };
  return (
    <div className="card flex items-center gap-4">
      <div className={clsx('flex h-12 w-12 items-center justify-center rounded-xl', colors[color])}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold">{value ?? '—'}</p>
      </div>
    </div>
  );
}
