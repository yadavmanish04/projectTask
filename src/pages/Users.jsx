import { useEffect, useState } from 'react';
import { Search, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { userApi } from '../api/user.api';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/format';
import { Navigate } from 'react-router-dom';

export default function Users() {
  const { user: me } = useAuth();
  if (me?.role !== 'admin') {
  return <Navigate to="/dashboard" replace />;
}
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (q = '') => {
    setLoading(true);
    userApi.list(q)
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    load(e.target.value);
  };

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'member' : 'admin';
    try {
      await userApi.adminUpdate(u._id, { role: newRole });
      setUsers((prev) => prev.map((x) => x._id === u._id ? { ...x, role: newRole } : x));
      toast.success(`${u.name} is now ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    try {
      await userApi.adminDelete(u._id);
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-slate-500">Manage all registered team members.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search name or email..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Joined</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((u) => {
                const isSelf = u._id === me?._id;
                const isRootAdmin = u.email === 'admin@gmail.com';
                return (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar user={u} size={34} />
                        <span className="font-medium">{u.name}</span>
                        {isSelf && <span className="badge bg-brand-100 text-brand-700">You</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-700'} capitalize`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {!isSelf && !isRootAdmin && (
                          <>
                            <button
                              onClick={() => toggleRole(u)}
                              title={u.role === 'admin' ? 'Demote to member' : 'Promote to admin'}
                              className="btn-ghost p-1.5 text-slate-500 hover:text-brand-600"
                            >
                              {u.role === 'admin' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                            </button>
                            <button
                              onClick={() => handleDelete(u)}
                              title="Delete user"
                              className="btn-ghost p-1.5 text-slate-500 hover:text-rose-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                        {isRootAdmin && (
                          <span className="text-xs text-slate-400 italic">root admin</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
