import { create } from 'zustand';
import { tokenStorage } from '@/lib/token-storage';

type User = { email: string };

type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  token: string | null;
  initAuth: () => void;
  login: (user: User, token?: string) => void;
  logout: () => void;
  reset: () => void;
};

const initialState: Pick<AuthState, 'isAuthenticated' | 'isInitialized' | 'user' | 'token'> = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  token: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  initAuth: () => {
    try {
      const token = tokenStorage.get();
      if (token) {
        // user is null after reload — only token is persisted.
        // consuming apps must re-fetch the profile after initAuth.
        set({ isAuthenticated: true, token, user: null });
      }
    } catch {
      // localStorage failure — treat as unauthenticated
    } finally {
      set({ isInitialized: true });
    }
  },
  login: (user, token) => {
    if (token) tokenStorage.set(token);
    set({ isAuthenticated: true, user, token: token ?? null });
  },
  logout: () => {
    tokenStorage.delete();
    set({ isAuthenticated: false, user: null, token: null });
  },
  reset: () => {
    tokenStorage.delete();
    set(initialState);
  },
}));
