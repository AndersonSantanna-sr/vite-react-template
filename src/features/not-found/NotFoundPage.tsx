import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFoundPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-4xl font-bold'>404</h1>
      <p className='text-muted-foreground'>Página não encontrada</p>
      <Link to='/' className={cn(buttonVariants({ variant: 'outline' }))}>
        Voltar ao início
      </Link>
    </div>
  );
}
