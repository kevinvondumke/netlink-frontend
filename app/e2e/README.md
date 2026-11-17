# Netlink E2E Testing Documentation

This directory contains Playwright end-to-end (E2E) browser test suites for Netlink.
These tests simulate human user interactions against the integrated application (Browser -> Vue Router & Pinia -> Express API -> PostgreSQL).

---

## E2E User Paths Matrix

| Journey / Path | Precondition | User Action | Expected Observable Outcome | Test File | Test Layer |
|---|---|---|---|---|---|
| **Registration E2E** | Unauthenticated, on `/register` | Fills valid name, unique `@netlink.local` email, complex password, clicks "Sign Up" | Form submits; router navigates to `/login`; "Log into Netlink" heading visible | `auth-journey.spec.ts` | E2E |
| **Registration Validation** | Unauthenticated, on `/register` | Types non-`@netlink.local` email (e.g. `@gmail.com`) | Inline error "* Email must end with '@netlink.local'." displays; stays on `/register` | `auth-journey.spec.ts` | E2E (UI Client) |
| **Login E2E** | Existing registered user, on `/login` | Fills registered credentials, clicks "Log in" | Router navigates to `/dashboard`; authenticated navbar & Logout button visible | `auth-journey.spec.ts` | E2E |
| **Invalid Credentials** | Unauthenticated, on `/login` | Fills wrong password, clicks "Log in" | Error message "Invalid login credentials. Please try again." appears; stays on `/login` | `auth-journey.spec.ts` | E2E |
| **Feed Critical Path** | Authenticated session | Navigates to `/dashboard` | Navigation shell renders; "Latest Posts" feed heading and container visible | `auth-journey.spec.ts`, `protected-routes.spec.ts` | E2E |
| **Logout E2E** | Authenticated session on `/dashboard` | Clicks "Logout" in navbar | Session cookie & local storage cleared; redirected to `/login`; subsequent `/dashboard` access blocked | `auth-journey.spec.ts` | E2E |
| **Protected Route Redirect** | Unauthenticated session | Enters `/dashboard` directly into URL bar | Client router guard intercepts; redirects immediately to `/login` | `protected-routes.spec.ts` | E2E |
| **Session Loss Recovery** | Active session on `/dashboard` | Cookies & local storage cleared (session dropped) | Navigating to `/dashboard` rejects access; redirected to `/login` | `protected-routes.spec.ts` | E2E |

---

## Test Execution Commands

```bash
# Run all E2E tests in Chromium
npm run test:e2e -- --project=chromium

# Run with trace recording enabled for forensic analysis
npm run test:e2e -- --project=chromium --trace on

# Open Playwright HTML report
npx playwright show-report

# Inspect a generated trace file
npx playwright show-trace test-results/<folder>/trace.zip
```
