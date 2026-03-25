---
title: Right-Size Your Test Pyramid
impact: CRITICAL
impactDescription: Wrong test distribution wastes 50% of testing effort
tags: test-pyramid, strategy, unit, integration, e2e, coverage
---

## Right-Size Your Test Pyramid

Match test distribution to your application type and risk profile.

### The Standard Pyramid

```
        ╱  E2E  ╲         5-10% — Critical user journeys only
       ╱─────────╲
      ╱ Integration╲      20-30% — API contracts, component integration
     ╱───────────────╲
    ╱    Unit Tests    ╲   60-70% — Business logic, utilities, edge cases
   ╱─────────────────────╲
```

### Adapt to Your Context

| Application Type | Unit | Integration | E2E |
|-----------------|------|-------------|-----|
| **Business logic heavy** (fintech, healthcare) | 70% | 20% | 10% |
| **CRUD API** (standard backend) | 40% | 50% | 10% |
| **UI-heavy app** (consumer mobile) | 30% | 30% | 40% |
| **Data pipeline** (ETL, analytics) | 50% | 40% | 10% |

### What to Test at Each Level

| Level | Test | Don't Test |
|-------|------|-----------|
| **Unit** | Pure functions, business logic, validation, calculations, edge cases | UI rendering, API calls, database |
| **Integration** | API endpoint behavior, DB queries, service interactions, auth flows | Individual function logic, CSS |
| **E2E** | Critical user journeys (signup, purchase, core workflow) | Every permutation, edge cases, errors |

### Coverage Targets

```
Realistic targets (not 100% everywhere):
├── Unit tests: 80%+ line coverage on business logic
├── Integration tests: All API endpoints, all DB queries
├── E2E tests: Top 5-10 user journeys
└── No tests needed: Config files, type definitions, simple getters
```

### Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Ice Cream Cone (mostly E2E) | Push tests down — E2E is slow and flaky |
| 100% coverage goal | Focus on risk areas, not vanity metrics |
| Testing implementation details | Test behavior — "when I click X, I see Y" |
| No integration tests | Add API/contract tests — they catch most real bugs |
| Flaky tests kept alive | Fix or delete — flaky tests erode trust in the suite |
