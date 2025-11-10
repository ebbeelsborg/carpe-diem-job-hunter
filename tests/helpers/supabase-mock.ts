import { vi } from 'vitest';

/**
 * Mock Supabase client for testing
 */
export const createMockSupabaseClient = () => {
  return {
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  };
};

/**
 * Create a mock JWT token for testing
 */
export const createMockJWT = (userId: string): string => {
  // This is a simplified mock - in real tests you might use jsonwebtoken
  const payload = {
    sub: userId,
    aud: 'authenticated',
    role: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  };
  
  // Base64 encode a mock JWT structure
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = 'mock-signature';
  
  return `${header}.${body}.${signature}`;
};

/**
 * Mock Supabase auth.getUser response for testing
 */
export const mockSupabaseUser = (userId: string) => {
  return {
    data: {
      user: {
        id: userId,
        email: `test-${userId}@example.com`,
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
      },
    },
    error: null,
  };
};

/**
 * Mock failed Supabase auth response
 */
export const mockSupabaseAuthError = () => {
  return {
    data: { user: null },
    error: {
      message: 'Invalid token',
      status: 401,
    },
  };
};

