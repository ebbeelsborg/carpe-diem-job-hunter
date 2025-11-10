import { beforeAll, afterAll, beforeEach, vi } from 'vitest';

// Set mock environment variables IMMEDIATELY at module load (before any imports)
// This ensures they're available when other modules load
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = 'https://test-project.supabase.co';
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://test@localhost:5432/test_db';
}

beforeAll(() => {
  // Additional test setup if needed
});

afterAll(() => {
  // Cleanup if needed
});

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

