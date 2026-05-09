import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginFormData } from './schemas/auth';
import { useLogin } from './hooks/useLogin';

export default function LoginPage() {
  const { mutate: login, isPending, isError } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <Card className='w-full max-w-sm'>
        {/* TODO: update branding and copy */}
        <CardHeader>
          <CardTitle>Bem-vindo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => login(data))} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <Controller
                control={control}
                name='email'
                render={({ field }) => (
                  <Input
                    {...field}
                    type='email'
                    placeholder='Email'
                    autoComplete='email'
                    data-testid='login-email-input'
                  />
                )}
              />
              {errors.email && (
                <p className='text-sm text-destructive' data-testid='login-email-error'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <Controller
                control={control}
                name='password'
                render={({ field }) => (
                  <Input
                    {...field}
                    type='password'
                    placeholder='Senha'
                    autoComplete='current-password'
                    data-testid='login-password-input'
                  />
                )}
              />
              {errors.password && (
                <p className='text-sm text-destructive' data-testid='login-password-error'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {isError && (
              <p className='text-sm text-destructive' data-testid='login-error'>
                Email ou senha inválidos
              </p>
            )}

            <Button type='submit' disabled={!isValid || isPending} data-testid='login-button'>
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
