import { useEffect, useState } from 'react';
import {
  LayoutGrid, ListTodo, Loader2, CheckCircle2, AlertTriangle, FolderKanban,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import StatsCard from '../components/dashboard/StatsCard';
import Loader from '../components/common/Loader';
import { projectApi } from '../api/project.api';
import { formatDate } from '../utils/format';

const PIE_COLORS = ['#94a3b8', '#6366f1', '#10b981'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectApi.dashboard()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!stats) return null;

  const { counts, recent } = stats;
  const pieData = [
    { name: 'Todo', value: counts.todo },
    { name: 'In Progress', value: counts.inProgress },
    { name: 'Done', value: counts.done },
  ];
  const barData = [
    { name: 'Tasks', Total: counts.total, Done: counts.done, Overdue: counts.overdue },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your tasks and projects</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatsCard icon={FolderKanban} label="Projects" value={counts.projects} color="brand" />
        <StatsCard icon={LayoutGrid} label="Total Tasks" value={counts.total} color="sky" />
        <StatsCard icon={ListTodo} label="To Do" value={counts.todo} color="brand" />
        <StatsCard icon={Loader2} label="In Progress" value={counts.inProgress} color="amber" />
        <StatsCard icon={CheckCircle2} label="Completed" value={counts.done} color="green" />
        <StatsCard icon={AlertTriangle} label="Overdue" value={counts.overdue} color="rose" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 font-semibold">Status distribution</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3 className="mb-4 font-semibold">Snapshot</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Done" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Overdue" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 font-semibold">Recent activity</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">No tasks yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {recent.map((t) => (
              <li key={t._id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-slate-500">{t.project?.title} · {t.status}</p>
                </div>
                <span className="text-xs text-slate-500">{formatDate(t.updatedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
