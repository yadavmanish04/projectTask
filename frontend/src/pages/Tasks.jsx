import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Select from '../components/common/Select';
import { fetchTasks, createTask, updateTask, deleteTask } from '../redux/slices/taskSlice';
import { fetchProjects } from '../redux/slices/projectSlice';

export default function Tasks() {
  const dispatch = useDispatch();
  const { items: tasks, loading } = useSelector((s) => s.tasks);
  const { items: projects } = useSelector((s) => s.projects);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ project: '', priority: '', search: '' });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    dispatch(fetchTasks(params));
  }, [dispatch, filters]);

  const handleSubmit = async (data) => {
    if (editing) {
      const res = await dispatch(updateTask({ id: editing._id, data }));
      if (res.meta.requestStatus === 'fulfilled') toast.success('Task updated');
    } else {
      const res = await dispatch(createTask(data));
      if (res.meta.requestStatus === 'fulfilled') toast.success('Task created');
    }
    setOpen(false);
    setEditing(null);
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateTask({ id, data: { status } }));
  };

  const handleDelete = async () => {
    if (!editing) return;
    if (!confirm('Delete this task?')) return;
    const res = await dispatch(deleteTask(editing._id));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Deleted');
      setOpen(false);
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-slate-500">Drag and drop to update status.</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus size={16} /> New Task</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Select value={filters.project} onChange={(e) => setFilters((f) => ({ ...f, project: e.target.value }))}>
          <option value="">All projects</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
        </Select>
        <Select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <KanbanBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onTaskClick={(t) => { setEditing(t); setOpen(true); }}
        />
      )}

      <Modal
        open={open}
        onClose={() => { setOpen(false); setEditing(null); }}
        title={editing ? 'Edit Task' : 'New Task'}
        footer={
          editing ? (
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          ) : null
        }
      >
        <TaskForm
          defaultValues={editing || {}}
          projects={projects}
          submitText={editing ? 'Update' : 'Create'}
          onSubmit={handleSubmit}
          onCancel={() => { setOpen(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}
