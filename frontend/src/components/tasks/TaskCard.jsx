import { Calendar, MessageSquare, AlertTriangle } from 'lucide-react';
import Avatar from '../common/Avatar';
import { formatDate, isOverdue } from '../../utils/format';
import clsx from 'clsx';

const priorityColors = {
  low: 'bg-slate-200 text-slate-700',
  medium: 'bg-sky-100 text-sky-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-rose-100 text-rose-700',
};

export default function TaskCard({ task, onClick }) {
  const overdue = isOverdue(task.dueDate, task.status);
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="font-medium leading-snug">{task.title}</p>
        <span className={clsx('badge', priorityColors[task.priority])}>{task.priority}</span>
      </div>
      {task.description && (
        <p className="mb-2 line-clamp-2 text-xs text-slate-500">{task.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className={clsx('flex items-center gap-1', overdue && 'text-rose-500 font-medium')}>
          {overdue ? <AlertTriangle size={12} /> : <Calendar size={12} />}
          {formatDate(task.dueDate)}
        </div>
        <div className="flex items-center gap-2">
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-1"><MessageSquare size={12} /> {task.comments.length}</span>
          )}
          <div className="flex -space-x-1">
            {(task.assignedTo || []).slice(0, 3).map((u) => (
              <Avatar key={u._id} user={u} size={20} className="ring-2 ring-white dark:ring-slate-800" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
