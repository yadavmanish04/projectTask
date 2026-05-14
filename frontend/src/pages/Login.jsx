import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { loginSchema } from '../validations/auth.schema';
import { loginThunk } from '../redux/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(loginSchema) });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    const res = await dispatch(loginThunk(data));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } else {
      toast.error(res.payload || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4 dark:from-slate-900 dark:to-slate-950">
      <div className="card w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold">Sign in</h1>
        <p className="mb-6 text-sm text-slate-500">Welcome back to TaskFlow.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" autoComplete="email"
            error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" autoComplete="current-password"
            error={errors.password?.message} {...register('password')} />
          <Button type="submit" className="w-full" loading={isSubmitting}>Sign in</Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          No account? <Link to="/signup" className="text-brand-600 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
