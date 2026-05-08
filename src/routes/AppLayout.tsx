import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) return null;
  if (!isAuthenticated) return <Navigate to='/login' replace />;
  return <Outlet />;
}
