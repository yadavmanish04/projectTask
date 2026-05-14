import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="md:hidden text-lg font-bold text-brand-600">TaskFlow</div>
      <div className="ml-auto flex items-center gap-3">
        <button onClick={toggle} className="btn-ghost p-2" aria-label="toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <Avatar user={user} size={32} />
            <div className="hidden text-right text-xs sm:block">
              <div className="font-medium">{user.name}</div>
              <div className="text-slate-500 capitalize">{user.role}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="btn-ghost p-2" aria-label="logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
