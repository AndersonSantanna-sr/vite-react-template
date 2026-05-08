import { beforeEach, describe, expect, it } from 'vitest';
import { tokenStorage } from '../token-storage';

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no token stored', () => {
    expect(tokenStorage.get()).toBeNull();
  });

  it('stores and retrieves a token', () => {
    tokenStorage.set('abc123');
    expect(tokenStorage.get()).toBe('abc123');
  });

  it('deletes a stored token', () => {
    tokenStorage.set('abc123');
    tokenStorage.delete();
    expect(tokenStorage.get()).toBeNull();
  });

  it('overwrites existing token on set', () => {
    tokenStorage.set('first');
    tokenStorage.set('second');
    expect(tokenStorage.get()).toBe('second');
  });
});
