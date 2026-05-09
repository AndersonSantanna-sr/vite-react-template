import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { type LoginFormData } from '../schemas/auth';

// TODO: update LoginResponse to match your API's actual response shape
type LoginResponse = {
  user: { email: string };
  token: string;
};

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      // TODO: update endpoint to match your API
      api.post<LoginResponse>('/auth/login', data).then((r) => r.data),
    onSuccess: ({ user, token }) => {
      login(user, token);
      toast.success('Login realizado com sucesso');
    },
    onError: () => {
      toast.error('Email ou senha inválidos');
    },
  });
}
