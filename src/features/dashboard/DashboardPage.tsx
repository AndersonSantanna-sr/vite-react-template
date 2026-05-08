import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      {user?.email && (
        <p className='text-muted-foreground' data-testid='dashboard-email'>
          {user.email}
        </p>
      )}
      <Button variant='outline' onClick={logout} data-testid='logout-button'>
        Sair
      </Button>
    </div>
  );
}
