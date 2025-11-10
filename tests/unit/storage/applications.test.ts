import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatabaseStorage } from '@server/storage';
import { db } from '@server/db';
import { applications } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { createMockApplication } from '../../helpers/test-data';

// Mock the db module
vi.mock('@server/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('DatabaseStorage - Applications', () => {
  let storage: DatabaseStorage;
  const mockUserId = 'test-user-123';
  const mockUserIdOther = 'test-user-456';

  beforeEach(() => {
    storage = new DatabaseStorage();
    vi.clearAllMocks();
  });

  describe('getApplications', () => {
    it('should fetch applications for a specific user', async () => {
      const mockApps = [
        { id: '1', userId: mockUserId, companyName: 'Google', ...createMockApplication() },
        { id: '2', userId: mockUserId, companyName: 'Microsoft', ...createMockApplication() },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockApps),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getApplications(mockUserId);

      expect(result).toEqual(mockApps);
      expect(db.select).toHaveBeenCalled();
    });

    it('should filter applications by status', async () => {
      const mockApps = [
        { id: '1', userId: mockUserId, status: 'offer', ...createMockApplication({ status: 'offer' }) },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockApps),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getApplications(mockUserId, { status: 'offer' });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('offer');
    });

    it('should filter applications by search term', async () => {
      const mockApps = [
        { id: '1', userId: mockUserId, companyName: 'Google', ...createMockApplication() },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockApps),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getApplications(mockUserId, { search: 'Google' });

      expect(result).toHaveLength(1);
    });
  });

  describe('getApplication', () => {
    it('should fetch a single application by id', async () => {
      const mockApp = { id: '1', userId: mockUserId, ...createMockApplication() };

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockApp]),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getApplication(mockUserId, '1');

      expect(result).toEqual(mockApp);
    });

    it('should return undefined for application belonging to different user', async () => {
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getApplication(mockUserIdOther, '1');

      expect(result).toBeUndefined();
    });

    it('should return undefined for non-existent application', async () => {
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getApplication(mockUserId, 'non-existent-id');

      expect(result).toBeUndefined();
    });
  });

  describe('createApplication', () => {
    it('should create a new application', async () => {
      const newApp = createMockApplication();
      const createdApp = { id: 'new-id', userId: mockUserId, ...newApp };

      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdApp]),
      };

      vi.mocked(db.insert).mockReturnValue(mockInsert as any);

      const result = await storage.createApplication(mockUserId, newApp);

      expect(result).toEqual(createdApp);
      expect(db.insert).toHaveBeenCalledWith(applications);
    });

    it('should include userId in created application', async () => {
      const newApp = createMockApplication();
      const createdApp = { id: 'new-id', userId: mockUserId, ...newApp };

      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdApp]),
      };

      vi.mocked(db.insert).mockReturnValue(mockInsert as any);

      const result = await storage.createApplication(mockUserId, newApp);

      expect(result.userId).toBe(mockUserId);
    });
  });

  describe('updateApplication', () => {
    it('should update an existing application', async () => {
      const updates = { companyName: 'Updated Company' };
      const updatedApp = { id: '1', userId: mockUserId, ...createMockApplication(), ...updates };

      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedApp]),
      };

      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await storage.updateApplication(mockUserId, '1', updates);

      expect(result).toEqual(updatedApp);
      expect(result?.companyName).toBe('Updated Company');
    });

    it('should return undefined when updating non-existent application', async () => {
      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await storage.updateApplication(mockUserId, 'non-existent', { companyName: 'Test' });

      expect(result).toBeUndefined();
    });

    it('should not allow updating applications of other users', async () => {
      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await storage.updateApplication(mockUserIdOther, '1', { companyName: 'Hacked' });

      expect(result).toBeUndefined();
    });
  });

  describe('deleteApplication', () => {
    it('should delete an application', async () => {
      const mockDelete = {
        where: vi.fn().mockResolvedValue({ rowCount: 1 }),
      };

      vi.mocked(db.delete).mockReturnValue(mockDelete as any);

      const result = await storage.deleteApplication(mockUserId, '1');

      expect(result).toBe(true);
    });

    it('should return false when deleting non-existent application', async () => {
      const mockDelete = {
        where: vi.fn().mockResolvedValue({ rowCount: 0 }),
      };

      vi.mocked(db.delete).mockReturnValue(mockDelete as any);

      const result = await storage.deleteApplication(mockUserId, 'non-existent');

      expect(result).toBe(false);
    });

    it('should not allow deleting applications of other users', async () => {
      const mockDelete = {
        where: vi.fn().mockResolvedValue({ rowCount: 0 }),
      };

      vi.mocked(db.delete).mockReturnValue(mockDelete as any);

      const result = await storage.deleteApplication(mockUserIdOther, '1');

      expect(result).toBe(false);
    });
  });

  describe('getApplicationStats', () => {
    it('should return application statistics', async () => {
      const mockApps = [
        { id: '1', userId: mockUserId, status: 'applied', ...createMockApplication() },
        { id: '2', userId: mockUserId, status: 'offer', ...createMockApplication({ status: 'offer' }) },
        { id: '3', userId: mockUserId, status: 'applied', ...createMockApplication() },
      ];

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue(mockApps),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getApplicationStats(mockUserId);

      expect(result.total).toBe(3);
      expect(result.byStatus['applied']).toBe(2);
      expect(result.byStatus['offer']).toBe(1);
    });

    it('should return empty stats for user with no applications', async () => {
      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await storage.getApplicationStats(mockUserId);

      expect(result.total).toBe(0);
      expect(Object.keys(result.byStatus)).toHaveLength(0);
    });
  });
});

