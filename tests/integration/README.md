# Integration Tests

Integration tests require a real database connection.

## Setup

1. Create a test database:
```bash
createdb interview_prep_tracker_test
```

2. Set environment variables in `.env.test`:
```env
TEST_DATABASE_URL=postgresql://username@localhost:5432/interview_prep_tracker_test
```

3. Run migrations:
```bash
DATABASE_URL=$TEST_DATABASE_URL npm run db:push
```

## Running Integration Tests

```bash
# Run only integration tests
npm test -- tests/integration

# Run with database cleanup
npm test -- tests/integration --sequence.setupFiles
```

## Writing Integration Tests

Integration tests should:
- Use real database connections
- Test end-to-end workflows
- Clean up test data after each test
- Test interactions between multiple components

