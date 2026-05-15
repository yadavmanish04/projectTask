import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { fetchMeThunk } from './redux/slices/authSlice';
import { storage } from './utils/storage';

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (storage.getToken()) dispatch(fetchMeThunk());
  }, [dispatch]);

  return <AppRoutes />;
}
