import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatabaseStorage } from '@server/storage';
import { db } from '@server/db';
import { createMockInterview, createMockApplication } from '../../helpers/test-data';

// Mock the db module
vi.mock('@server/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('DatabaseStorage - Interviews', () => {
  let storage: DatabaseStorage;
  const mockUserId = 'test-user-123';
  const mockAppId = 'test-app-456';

  beforeEach(() => {
    storage = new DatabaseStorage();
    vi.clearAllMocks();
  });

  describe('getInterviews', () => {
    it('should fetch interviews for user applications', async () => {
      const mockInterviews = [
        { 
          id: '1', 
          applicationId: mockAppId, 
          companyName: 'Google',
          positionTitle: 'SWE',
          ...createMockInterview(mockAppId) 
        },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockInterviews),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getInterviews(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0].companyName).toBe('Google');
    });

    it('should filter interviews by applicationId', async () => {
      const mockInterviews = [
        { 
          id: '1', 
          applicationId: mockAppId,
          ...createMockInterview(mockAppId) 
        },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockInterviews),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getInterviews(mockUserId, { applicationId: mockAppId });

      expect(result).toHaveLength(1);
    });

    it('should filter interviews by status', async () => {
      const mockInterviews = [
        { 
          id: '1', 
          applicationId: mockAppId,
          status: 'completed',
          ...createMockInterview(mockAppId, { status: 'completed' }) 
        },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockInterviews),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getInterviews(mockUserId, { status: 'completed' });

      expect(result[0].status).toBe('completed');
    });
  });

  describe('getUpcomingInterviews', () => {
    it('should fetch only scheduled upcoming interviews', async () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const mockInterviews = [
        { 
          id: '1', 
          applicationId: mockAppId,
          status: 'scheduled',
          interviewDate: tomorrow,
          ...createMockInterview(mockAppId) 
        },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockInterviews),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getUpcomingInterviews(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('scheduled');
    });

    it('should respect the limit parameter', async () => {
      const mockInterviews = [
        { id: '1', applicationId: mockAppId, ...createMockInterview(mockAppId) },
        { id: '2', applicationId: mockAppId, ...createMockInterview(mockAppId) },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockInterviews.slice(0, 2)),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getUpcomingInterviews(mockUserId, 2);

      expect(result).toHaveLength(2);
    });
  });

  describe('createInterview', () => {
    it('should create an interview if application belongs to user', async () => {
      const newInterview = createMockInterview(mockAppId);
      const mockApp = { id: mockAppId, userId: mockUserId, ...createMockApplication() };
      
      // Mock getApplication
      const mockSelectQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockApp]),
      };
      
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: 'new-id', ...newInterview }]),
      };

      vi.mocked(db.select).mockReturnValue(mockSelectQuery as any);
      vi.mocked(db.insert).mockReturnValue(mockInsert as any);

      const result = await storage.createInterview(mockUserId, newInterview);

      expect(result.applicationId).toBe(mockAppId);
    });

    it('should throw error if application does not belong to user', async () => {
      const newInterview = createMockInterview(mockAppId);
      
      // Mock getApplication returning undefined
      const mockSelectQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValue(mockSelectQuery as any);

      await expect(
        storage.createInterview(mockUserId, newInterview)
      ).rejects.toThrow('Application not found or access denied');
    });
  });

  describe('updateInterview', () => {
    it('should update an interview', async () => {
      const updates = { status: 'completed' as const };
      const mockInterview = { id: '1', applicationId: mockAppId, ...createMockInterview(mockAppId) };
      
      // Mock getInterview
      const mockSelectQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockInterview]),
      };
      
      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ ...mockInterview, ...updates }]),
      };

      vi.mocked(db.select).mockReturnValue(mockSelectQuery as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await storage.updateInterview(mockUserId, '1', updates);

      expect(result?.status).toBe('completed');
    });

    it('should return undefined if interview does not belong to user', async () => {
      const mockSelectQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValue(mockSelectQuery as any);

      const result = await storage.updateInterview(mockUserId, 'non-existent', { status: 'completed' });

      expect(result).toBeUndefined();
    });
  });

  describe('deleteInterview', () => {
    it('should delete an interview', async () => {
      const mockInterview = { id: '1', applicationId: mockAppId, ...createMockInterview(mockAppId) };
      
      // Mock getInterview
      const mockSelectQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockInterview]),
      };
      
      const mockDelete = {
        where: vi.fn().mockResolvedValue({ rowCount: 1 }),
      };

      vi.mocked(db.select).mockReturnValue(mockSelectQuery as any);
      vi.mocked(db.delete).mockReturnValue(mockDelete as any);

      const result = await storage.deleteInterview(mockUserId, '1');

      expect(result).toBe(true);
    });

    it('should return false if interview does not belong to user', async () => {
      const mockSelectQuery = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValue(mockSelectQuery as any);

      const result = await storage.deleteInterview(mockUserId, 'non-existent');

      expect(result).toBe(false);
    });
  });
});

