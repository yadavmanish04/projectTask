import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export const useAuth = () => {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  return {
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: !!auth.token,
    isAdmin: auth.user?.role === 'admin',
    logout: () => dispatch(logout()),
  };
};
