---
title: Maintainable E2E Test Architecture
impact: HIGH
impactDescription: Poor E2E architecture leads to flaky, unmaintainable test suites
tags: e2e, playwright, detox, page-object, automation
---

## Maintainable E2E Test Architecture

E2E tests should be reliable, readable, and fast to update when UI changes.

### Page Object Model

```typescript
// ✅ Correct: Abstract selectors into Page Objects
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }

  async expectError(message: string) {
    await expect(this.page.getByRole('alert')).toHaveText(message);
  }
}

// tests/login.spec.ts
test('successful login redirects to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user@test.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});

test('invalid credentials show error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user@test.com', 'wrong');
  await loginPage.expectError('Invalid email or password');
});
```

```typescript
// ❌ Incorrect: Hardcoded selectors in tests
test('login works', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email-input').fill('user@test.com');     // Brittle selector
  await page.locator('#password-input').fill('password123');     // Changes break all tests
  await page.locator('.btn-primary').click();                   // Not semantic
});
```

### Test Structure Best Practices

```typescript
// ✅ Arrange-Act-Assert with descriptive names
test.describe('Order Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Arrange: Set up consistent state
    await seedTestData({ user: testUser, cart: [testProduct] });
    await loginAs(page, testUser);
  });

  test('completes checkout with valid payment', async ({ page }) => {
    // Act
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillPayment(validCard);
    await checkoutPage.submit();

    // Assert
    await expect(page.getByText('Order Confirmed')).toBeVisible();
  });

  test('shows error for declined card', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillPayment(declinedCard);
    await checkoutPage.submit();

    await expect(page.getByText('Payment declined')).toBeVisible();
  });
});
```

### Selector Priority (Most → Least Stable)

| Priority | Selector Type | Example | When to Use |
|----------|--------------|---------|-------------|
| 1 | Role | `getByRole('button', { name: 'Submit' })` | Always first choice |
| 2 | Label | `getByLabel('Email')` | Form inputs |
| 3 | Text | `getByText('Welcome back')` | Static text |
| 4 | Test ID | `getByTestId('checkout-btn')` | When no semantic option |
| 5 | CSS/XPath | `locator('.btn-primary')` | Last resort only |

### Making E2E Tests Reliable

- ✅ Use `waitFor` / auto-waiting (Playwright has this built-in)
- ✅ Reset state before each test (fresh DB seed or API reset)
- ✅ Use test-specific data (don't depend on shared state between tests)
- ✅ Run tests in parallel with isolated browser contexts
- ❌ Don't use `sleep()` / fixed waits
- ❌ Don't depend on test execution order
