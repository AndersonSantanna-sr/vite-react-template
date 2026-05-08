import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/providers/QueryProvider';
import { useAuthStore } from '@/stores/auth-store';
import { router } from '@/routes/router';

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
