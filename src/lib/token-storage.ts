const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  delete: (): void => localStorage.removeItem(TOKEN_KEY),
};
