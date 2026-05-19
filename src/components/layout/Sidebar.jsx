import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ListChecks, User, Users } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';

const baseLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === 'admin'
    ? [...baseLinks, { to: '/admin/users', label: 'Users', icon: Users }]
    : baseLinks;

  return (
<aside className="w-16 md:w-60 shrink-0 border-r border-slate-200 bg-white p-2 md:p-4 dark:border-slate-800 dark:bg-slate-900">      <div className="mb-6 px-2">
        <h1 className="text-xl font-bold text-brand-600">TaskFlow</h1>
        <p className="text-xs text-slate-500">Team task manager</p>
      </div>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              )
            }
          >
            <Icon size={18} />
<span className="hidden md:inline">{label}</span>          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
