import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, UserPlus, X } from 'lucide-react';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';
import { fetchProject, updateProject, deleteProject } from '../redux/slices/projectSlice';
import { fetchTasks, createTask, updateTask, deleteTask, upsertTask, removeTaskLocal } from '../redux/slices/taskSlice';
import { projectApi } from '../api/project.api';
import { userApi } from '../api/user.api';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const project = useSelector((s) => s.projects.current);
  const tasks = useSelector((s) => s.tasks.items);
  const [taskOpen, setTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = useSocket(id);

  useEffect(() => {
    Promise.all([dispatch(fetchProject(id)), dispatch(fetchTasks({ project: id }))])
      .finally(() => setLoading(false));
  }, [dispatch, id]);

  useEffect(() => {
    if (!socket) return;
    const onCreate = (t) => dispatch(upsertTask(t));
    const onUpdate = (t) => dispatch(upsertTask(t));
    const onDelete = ({ _id }) => dispatch(removeTaskLocal(_id));
    socket.on('task:created', onCreate);
    socket.on('task:updated', onUpdate);
    socket.on('task:deleted', onDelete);
    return () => {
      socket.off('task:created', onCreate);
      socket.off('task:updated', onUpdate);
      socket.off('task:deleted', onDelete);
    };
  }, [socket, dispatch]);

  if (loading || !project) return <Loader />;

  const isOwner = project.createdBy?._id === user?._id || user?.role === 'admin';

  const handleSaveTask = async (data) => {
    if (editingTask) {
      const res = await dispatch(updateTask({ id: editingTask._id, data }));
      if (res.meta.requestStatus === 'fulfilled') toast.success('Task updated');
    } else {
      const res = await dispatch(createTask({ ...data, project: id }));
      if (res.meta.requestStatus === 'fulfilled') toast.success('Task created');
    }
    setTaskOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async () => {
    if (!editingTask) return;
    if (!confirm('Delete this task?')) return;
    await dispatch(deleteTask(editingTask._id));
    setTaskOpen(false);
    setEditingTask(null);
  };

  const handleEditProject = async (data) => {
    const res = await dispatch(updateProject({ id, data }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Project updated');
      setEditProjectOpen(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project and all its tasks?')) return;
    await dispatch(deleteProject(id));
    toast.success('Deleted');
    navigate('/projects');
  };

  const openMembers = async () => {
    const res = await userApi.list('');
    setUsers(res.data.users);
    setMemberOpen(true);
  };

  const addMember = async (userId) => {
    await projectApi.addMember(id, userId);
    dispatch(fetchProject(id));
  };

  const removeMember = async (userId) => {
    await projectApi.removeMember(id, userId);
    dispatch(fetchProject(id));
  };

  const memberIds = new Set(project.teamMembers.map((m) => m._id));

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/projects')} className="btn-ghost text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{project.description || 'No description'}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="badge bg-brand-100 text-brand-700 capitalize">{project.status}</span>
              {project.deadline && (
                <span className="badge bg-slate-200 text-slate-700">
                  Due {new Date(project.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditProjectOpen(true)}>Edit</Button>
              <Button variant="danger" onClick={handleDeleteProject}><Trash2 size={16} /></Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm font-medium">Team:</span>
          <div className="flex flex-wrap gap-2">
            {project.teamMembers.map((m) => (
              <div key={m._id} className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                <Avatar user={m} size={20} />
                <span>{m.name}</span>
                {isOwner && m._id !== project.createdBy._id && (
                  <button onClick={() => removeMember(m._id)} className="text-slate-400 hover:text-rose-500">
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
            {isOwner && (
              <button onClick={openMembers} className="btn-ghost text-xs">
                <UserPlus size={14} /> Add
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Board</h2>
        <Button onClick={() => { setEditingTask(null); setTaskOpen(true); }}>
          <Plus size={16} /> New Task
        </Button>
      </div>

      <KanbanBoard
        tasks={tasks}
        onStatusChange={(taskId, status) => dispatch(updateTask({ id: taskId, data: { status } }))}
        onTaskClick={(t) => { setEditingTask(t); setTaskOpen(true); }}
      />

      <Modal
        open={taskOpen}
        onClose={() => { setTaskOpen(false); setEditingTask(null); }}
        title={editingTask ? 'Edit Task' : 'New Task'}
        footer={editingTask && <Button variant="danger" onClick={handleDeleteTask}>Delete</Button>}
      >
        <TaskForm
          defaultValues={editingTask || {}}
          lockedProject={id}
          submitText={editingTask ? 'Update' : 'Create'}
          onSubmit={handleSaveTask}
          onCancel={() => { setTaskOpen(false); setEditingTask(null); }}
        />
      </Modal>

      <Modal open={editProjectOpen} onClose={() => setEditProjectOpen(false)} title="Edit Project">
        <ProjectForm defaultValues={project} submitText="Update" onSubmit={handleEditProject} onCancel={() => setEditProjectOpen(false)} />
      </Modal>

      <Modal open={memberOpen} onClose={() => setMemberOpen(false)} title="Add Members">
        <ul className="max-h-80 divide-y divide-slate-200 overflow-y-auto dark:divide-slate-800">
          {users.filter((u) => !memberIds.has(u._id)).map((u) => (
            <li key={u._id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Avatar user={u} size={28} />
                <div className="text-sm">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => addMember(u._id)}>Add</Button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
