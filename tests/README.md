# Test Suite

This directory contains the test suite for the Interview Prep Tracker application.

## Structure

```
tests/
├── setup.ts                      # Global test setup and configuration
├── helpers/                      # Test utilities and mocks
│   ├── supabase-mock.ts         # Supabase client mocking utilities
│   └── test-data.ts             # Test data factories
└── unit/                        # Unit tests
    ├── middleware/
    │   └── auth.test.ts         # Auth middleware tests
    └── storage/
        ├── applications.test.ts # Application storage tests
        └── interviews.test.ts   # Interview storage tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Environment Setup

### Environment Variables

Create a `.env.test` file with test-specific configuration:

```env
# Test Database (use a separate database for tests)
TEST_DATABASE_URL=postgresql://username@localhost:5432/interview_prep_tracker_test
DATABASE_URL=postgresql://username@localhost:5432/interview_prep_tracker_test

# Supabase (can use test project or mock)
SUPABASE_URL=https://your-test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key

NODE_ENV=test
```

### Database Setup

Before running tests, ensure you have a test database:

```bash
# Create test database
createdb interview_prep_tracker_test

# Run migrations
DATABASE_URL=postgresql://username@localhost:5432/interview_prep_tracker_test npm run db:push
```

## Writing Tests

### Unit Tests

Unit tests should:
- Mock external dependencies (database, Supabase, etc.)
- Test individual functions in isolation
- Use the test data factories from `helpers/test-data.ts`

Example:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { DatabaseStorage } from '@server/storage';
import { createMockApplication } from '../../helpers/test-data';

describe('MyFeature', () => {
  it('should do something', () => {
    // Test implementation
  });
});
```

### Integration Tests

Integration tests should:
- Use a real test database
- Test multiple components working together
- Clean up after themselves

(To be implemented)

## Best Practices

1. **Isolation**: Each test should be independent
2. **Mocking**: Mock external services (Supabase, external APIs)
3. **Cleanup**: Clean up test data after each test
4. **Descriptive Names**: Use clear, descriptive test names
5. **AAA Pattern**: Arrange, Act, Assert

## Coverage Goals

- Unit test coverage: 80%+ on critical paths
- Storage layer: 90%+
- Middleware: 90%+
- Business logic: 80%+

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-deployment

## Troubleshooting

### Tests Fail Locally

1. Check your `.env.test` file is configured correctly
2. Ensure test database exists and migrations are applied
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Database Connection Issues

1. Verify PostgreSQL is running: `pg_isready`
2. Check connection string format
3. Ensure user has proper permissions

### Mock Issues

If Supabase mocks aren't working:
1. Clear vitest cache: `npx vitest --clearCache`
2. Restart your terminal/IDE
3. Check mock setup in `tests/setup.ts`

