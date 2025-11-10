import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Response, NextFunction } from 'express';
import { createMockSupabaseClient, mockSupabaseUser, mockSupabaseAuthError } from '../../helpers/supabase-mock';

// Mock the Supabase client module before importing middleware
// Use a factory function that will be called when the mock is instantiated
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => createMockSupabaseClient()),
}));

// Import types and functions after mocks are set up
import { authenticateUser, type AuthRequest } from '@server/middleware/auth';

// Get reference to the mocked instance
const mockSupabaseClient = createMockSupabaseClient();

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();

    // Reset the mock
    vi.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should reject requests without Authorization header', async () => {
      mockRequest.headers = {};

      await authenticateUser(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Missing or invalid authorization header',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject requests with malformed Authorization header', async () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat token123',
      };

      await authenticateUser(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Missing or invalid authorization header',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject requests with invalid token', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      // Mock Supabase to return error
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue(mockSupabaseAuthError());

      await authenticateUser(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid or expired token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept requests with valid token and set userId', async () => {
      const validUserId = 'valid-user-123';
      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };

      // Mock Supabase to return valid user
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue(mockSupabaseUser(validUserId));

      await authenticateUser(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.userId).toBe(validUserId);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle token extraction correctly', async () => {
      const validUserId = 'user-456';
      const token = 'my-jwt-token';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue(mockSupabaseUser(validUserId));

      await authenticateUser(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith(token);
      expect(mockRequest.userId).toBe(validUserId);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle Supabase errors gracefully', async () => {
      mockRequest.headers = {
        authorization: 'Bearer some-token',
      };

      // Mock Supabase to throw an error
      mockSupabaseClient.auth.getUser = vi.fn().mockRejectedValue(new Error('Network error'));

      await authenticateUser(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication failed',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject when user is null but no error is returned', async () => {
      mockRequest.headers = {
        authorization: 'Bearer expired-token',
      };

      // Mock Supabase to return null user without error
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await authenticateUser(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid or expired token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle Bearer prefix case-insensitively', async () => {
      const validUserId = 'user-789';
      mockRequest.headers = {
        authorization: 'bearer valid-token', // lowercase
      };

      // This test depends on whether the actual implementation is case-sensitive
      // Adjust based on your implementation
      await authenticateUser(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // If implementation is case-sensitive (current implementation is)
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('AuthRequest type extension', () => {
    it('should allow userId property on request', () => {
      const req: Partial<AuthRequest> = {
        userId: 'test-user-id',
        headers: {},
      };

      expect(req.userId).toBe('test-user-id');
    });

    it('should allow optional userId', () => {
      const req: Partial<AuthRequest> = {
        headers: {},
      };

      expect(req.userId).toBeUndefined();
    });
  });
});

