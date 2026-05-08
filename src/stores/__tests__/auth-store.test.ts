import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/token-storage', () => ({
  tokenStorage: {
    get: vi.fn(() => null),
    set: vi.fn(),
    delete: vi.fn(),
  },
}));

import { tokenStorage } from '@/lib/token-storage';
import { useAuthStore } from '../auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
    vi.clearAllMocks();
  });

  it('starts uninitialized and unauthenticated', () => {
    const { isAuthenticated, isInitialized } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(isInitialized).toBe(false);
  });

  it('initAuth sets isInitialized true with no stored token', () => {
    vi.mocked(tokenStorage.get).mockReturnValue(null);
    useAuthStore.getState().initAuth();
    expect(useAuthStore.getState().isInitialized).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('initAuth authenticates when token exists in storage', () => {
    vi.mocked(tokenStorage.get).mockReturnValue('stored-token');
    useAuthStore.getState().initAuth();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().token).toBe('stored-token');
  });

  it('login sets authenticated state and persists token', () => {
    useAuthStore.getState().login({ email: 'user@example.com' }, 'my-token');
    const { isAuthenticated, user, token } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user?.email).toBe('user@example.com');
    expect(token).toBe('my-token');
    expect(tokenStorage.set).toHaveBeenCalledWith('my-token');
  });

  it('login without token does not call tokenStorage.set', () => {
    useAuthStore.getState().login({ email: 'user@example.com' });
    expect(tokenStorage.set).not.toHaveBeenCalled();
  });

  it('logout clears auth state and removes token', () => {
    useAuthStore.getState().login({ email: 'user@example.com' }, 'my-token');
    useAuthStore.getState().logout();
    const { isAuthenticated, user, token } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(tokenStorage.delete).toHaveBeenCalled();
  });
});
