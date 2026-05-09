import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { type ReactNode } from 'react';

function Fallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-2xl font-bold'>Algo deu errado</h1>
      <p className='text-sm text-muted-foreground'>{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className='rounded-md border px-4 py-2 text-sm hover:bg-muted'
      >
        Tentar novamente
      </button>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={Fallback} onError={(error) => console.error(error)}>
      {children}
    </ReactErrorBoundary>
  );
}
