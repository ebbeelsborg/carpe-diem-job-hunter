import type { InsertApplication, InsertInterview, InsertResource, InsertQuestion } from '@shared/schema';

/**
 * Test data factories for creating mock entities
 */

export const createMockUser = (overrides?: Partial<{ id: string; email: string; username: string }>) => ({
  id: overrides?.id || 'test-user-id-123',
  email: overrides?.email || 'test@example.com',
  username: overrides?.username || 'testuser',
  password: null,
  googleId: null,
  createdAt: new Date(),
});

export const createMockApplication = (overrides?: Partial<InsertApplication>): InsertApplication => ({
  companyName: 'Test Company',
  positionTitle: 'Software Engineer',
  jobUrl: 'https://example.com/job',
  logoUrl: null,
  status: 'applied',
  salaryMin: 100000,
  salaryMax: 150000,
  location: 'San Francisco, CA',
  isRemote: false,
  applicationDate: new Date(),
  notes: 'Test notes',
  ...overrides,
});

export const createMockInterview = (
  applicationId: string,
  overrides?: Partial<InsertInterview>
): InsertInterview => ({
  applicationId,
  interviewType: 'technical',
  interviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  durationMinutes: 60,
  interviewerNames: 'Jane Doe',
  platform: 'Zoom',
  status: 'scheduled',
  prepNotes: 'Review algorithms',
  interviewNotes: null,
  questionsAsked: null,
  rating: null,
  followUpActions: null,
  ...overrides,
});

export const createMockResource = (overrides?: Partial<InsertResource>): InsertResource => ({
  title: 'Cracking the Coding Interview',
  url: 'https://example.com/resource',
  category: 'algorithms',
  notes: 'Great resource',
  isReviewed: false,
  linkedApplicationId: null,
  ...overrides,
});

export const createMockQuestion = (overrides?: Partial<InsertQuestion>): InsertQuestion => ({
  questionText: 'Tell me about yourself',
  answerText: 'I am a software engineer...',
  questionType: 'behavioral',
  isFavorite: false,
  tags: ['common', 'behavioral'],
  ...overrides,
});

