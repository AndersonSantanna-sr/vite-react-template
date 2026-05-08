import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { type LoginFormData } from '../schemas/auth';

type LoginResponse = {
  user: { email: string };
  token: string;
};

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      api.post<LoginResponse>('/auth/login', data).then((r) => r.data),
    onSuccess: ({ user, token }) => login(user, token),
  });
}
