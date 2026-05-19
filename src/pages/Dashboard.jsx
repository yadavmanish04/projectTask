import { useEffect, useState } from 'react';
import {
  LayoutGrid,
  ListTodo,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import Loader from '../components/common/Loader';
import { projectApi } from '../api/project.api';
import { formatDate } from '../utils/format';

// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProjects } from '../redux/slices/projectSlice';
// import { fetchTasks } from '../redux/slices/taskSlice';

const PIE_COLORS = ['#94a3b8', '#6366f1', '#10b981'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectApi
      .dashboard()
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
    {
      name: 'Tasks',
      Total: counts.total,
      Done: counts.done,
      Overdue: counts.overdue,
    },
  ];

  const statsCards = [
    {
      label: 'Projects',
      value: counts.projects,
      icon: FolderKanban,
    },
    {
      label: 'Total Tasks',
      value: counts.total,
      icon: LayoutGrid,
    },
    {
      label: 'To Do',
      value: counts.todo,
      icon: ListTodo,
    },
    {
      label: 'In Progress',
      value: counts.inProgress,
      icon: Loader2,
    },
    {
      label: 'Completed',
      value: counts.done,
      icon: CheckCircle2,
    },
    {
      label: 'Overdue',
      value: counts.overdue,
      icon: AlertTriangle,
    },
  ];

  return (
<div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-5 transition-colors">      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Dashboard Overview
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor your projects and task progress
        </p>
      </div>

      {/* Stats Cards */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        {statsCards.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"          >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.label}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {item.value}
                  </h2>
                </div>

                <div className="rounded-2xl bg-slate-100 p-3 transition group-hover:bg-slate-900">
                  <Icon className="h-5 w-5 text-slate-700 group-hover:text-white" />
                </div>

              </div>

            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

  {/* Pie Chart */}

  <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">

    {/* Background Glow */}

    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-100 blur-3xl opacity-60" />

    <div className="relative z-10">

      <div className="mb-5 flex items-start justify-between">

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Task Status
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Distribution of tasks
          </p>
        </div>

        <div className="rounded-2xl bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          Analytics
        </div>

      </div>

      <div className="flex items-center justify-center">

        <div style={{ width: '100%', height: 280 }}>

          <ResponsiveContainer>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                stroke="transparent"
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend
                verticalAlign="bottom"
                iconType="circle"
                height={30}
              />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>
    </div>
  </div>

  {/* Bar Chart */}

  <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-white to-slate-50  dark:from-slate-900 dark:to-slate-950 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">

    {/* Background Glow */}

    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-100 blur-3xl opacity-60" />

    <div className="relative z-10">

      <div className="mb-5 flex items-start justify-between">

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Performance Snapshot
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Completed vs overdue tasks
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
          Reports
        </div>

      </div>

      <div style={{ width: '100%', height: 280 }}>

        <ResponsiveContainer>

          <BarChart data={barData} barSize={36}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              height={30}
            />

            <Bar
              dataKey="Total"
              fill="#6366f1"
              radius={[12, 12, 0, 0]}
            />

            <Bar
              dataKey="Done"
              fill="#10b981"
              radius={[12, 12, 0, 0]}
            />

            <Bar
              dataKey="Overdue"
              fill="#f43f5e"
              radius={[12, 12, 0, 0]}
            />

          </BarChart> 

        </ResponsiveContainer>

      </div>

    </div>
  </div>
</div>

      {/* Recent Activity */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Recent Activity
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Latest updates from your workspace
          </p>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 py-12 text-center text-sm text-slate-500">
            No recent activity found
          </div>
        ) : (
          <div className="space-y-4">

            {recent.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100"
              >

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {t.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {t.project?.title} • {t.status}
                  </p>
                </div>

                <span className="text-xs font-medium text-slate-400">
                  {formatDate(t.updatedAt)}
                </span>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}