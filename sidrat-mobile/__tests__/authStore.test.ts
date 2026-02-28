/**
 * Auth store tests.
 *
 * Validates auth state management: authentication, anonymous sessions,
 * and state clearing.
 */

import { useAuthStore } from '../src/stores/authStore';

beforeEach(() => {
  useAuthStore.setState({
    isAuthenticated: false,
    isAnonymous: false,
    userId: null,
  });
});

describe('AuthStore', () => {
  it('should start unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAnonymous).toBe(false);
    expect(state.userId).toBeNull();
  });

  it('should set authenticated state for Apple sign-in', () => {
    useAuthStore.getState().setAuthenticated('user-123', false);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAnonymous).toBe(false);
    expect(state.userId).toBe('user-123');
  });

  it('should set authenticated state for anonymous session', () => {
    useAuthStore.getState().setAuthenticated('anon-456', true);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAnonymous).toBe(true);
    expect(state.userId).toBe('anon-456');
  });

  it('should clear auth state', () => {
    useAuthStore.getState().setAuthenticated('user-123', false);
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAnonymous).toBe(false);
    expect(state.userId).toBeNull();
  });
});
