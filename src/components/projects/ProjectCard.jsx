import { Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/format';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  'on-hold': 'bg-amber-100 text-amber-700',
  completed: 'bg-sky-100 text-sky-700',
  archived: 'bg-slate-200 text-slate-600',
};

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`} className="card transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <span className={`badge ${statusColors[project.status] || ''}`}>{project.status}</span>
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-slate-500">{project.description || 'No description'}</p>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar size={14} /> {formatDate(project.deadline)}
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} /> {project.teamMembers?.length || 0}
        </div>
      </div>
      <div className="mt-3 flex -space-x-2">
        {(project.teamMembers || []).slice(0, 5).map((m) => (
          <Avatar key={m._id} user={m} size={26} className="ring-2 ring-white dark:ring-slate-900" />
        ))}
      </div>
    </Link>
  );
}
