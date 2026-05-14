import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api/user.api';
import { fetchMeThunk } from '../redux/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';

export default function Profile() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { name: user?.name, avatar: user?.avatar || '' },
  });

  const onSubmit = async (data) => {
    try {
      await userApi.updateMe(data);
      await dispatch(fetchMeThunk());
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="card">
        <div className="mb-6 flex items-center gap-4">
          <Avatar user={user} size={64} />
          <div>
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <p className="text-xs uppercase tracking-wide text-brand-600">{user?.role}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full name" {...register('name')} />
          <Input label="Avatar URL" placeholder="https://..." {...register('avatar')} />
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>Save changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
