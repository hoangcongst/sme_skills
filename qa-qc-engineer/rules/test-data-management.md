---
title: Test Data Management
impact: MEDIUM
impactDescription: Bad test data causes 40% of flaky tests
tags: test-data, fixtures, seeding, factories, cleanup
---

## Test Data Management

Good test data is isolated, predictable, and self-contained. Bad test data is the #1 cause of flaky tests.

### Principles

1. **Each test owns its data** — never depend on data from another test
2. **Create in setup, clean in teardown** — tests leave no trace
3. **Use factories, not fixtures** — factories are flexible, fixtures are rigid
4. **Minimal data** — create only what the test needs, nothing more
5. **Deterministic** — no random values in assertions (use fixed seeds if randomizing)

### Factory Pattern

```python
# ✅ Test factories: Create test data with sensible defaults + overrides
class UserFactory:
    _counter = 0

    @classmethod
    def create(cls, **overrides) -> dict:
        cls._counter += 1
        defaults = {
            "email": f"user{cls._counter}@test.com",
            "name": f"Test User {cls._counter}",
            "role": "user",
            "active": True,
        }
        return {**defaults, **overrides}

# Usage in tests
def test_admin_can_delete_users():
    admin = UserFactory.create(role="admin")
    target = UserFactory.create()
    # ... test with fresh, isolated data
```

### Database Strategies

| Strategy | Speed | Isolation | Use When |
|----------|-------|-----------|----------|
| **Transaction rollback** | Fast | Perfect | Unit/integration tests |
| **Truncate tables** | Medium | Good | API tests |
| **Fresh database** | Slow | Perfect | E2E tests, CI |
| **In-memory DB** | Fast | Perfect | Unit tests (SQLite) |

```python
# ✅ Transaction rollback (fastest)
@pytest.fixture(autouse=True)
async def db_session():
    async with engine.begin() as conn:
        session = AsyncSession(bind=conn)
        yield session
        await conn.rollback()  # All changes undone automatically
```

### Test Data Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Shared mutable test data | Each test creates its own data |
| Tests depend on execution order | Use independent setup/teardown |
| Production data in tests | Use factories with deterministic data |
| Magic numbers in assertions | Use named constants or factory outputs |
| Giant seed files | Minimal factories per test |
