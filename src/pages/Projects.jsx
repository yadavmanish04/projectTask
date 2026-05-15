import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { fetchProjects, createProject } from '../redux/slices/projectSlice';
import { useAuth } from '../hooks/useAuth';

export default function Projects() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, loading } = useSelector((s) => s.projects);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProjects({ search }));
  }, [dispatch, search]);

  const handleCreate = async (data) => {
    const res = await dispatch(createProject(data));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Project created');
      setOpen(false);
    } else {
      toast.error('Failed to create');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-slate-500">Manage and collaborate on projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {user?.role === 'admin' && (
            <Button onClick={() => setOpen(true)}>
              <Plus size={16} /> New
            </Button>
          )}        
          </div>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="card text-center text-sm text-slate-500">No projects yet. Create one!</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New Project">
        <ProjectForm onSubmit={handleCreate} onCancel={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
