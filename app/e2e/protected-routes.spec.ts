import { test, expect } from '@playwright/test';

test('Unauthenticated visitor navigating to protected route is redirected to login page', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('heading', { name: 'Log into Netlink', exact: true })).toBeVisible();
});

test('User who loses session state is redirected to login when accessing protected route', async ({ page }) => {
  // UNIQUE TEST USER
  const timestamp = Date.now();
  const email = `test_${timestamp}_user@netlink.local`;
  const randomSuffix = Math.random().toString(36).substring(2, 8).replace(/[0-9]/g, 'a');
  const name = `Test User ${randomSuffix}`;
  const password = `TestPassword123!`;  
  
  // REGISTER PAGE
  await page.goto('/register');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Full Name').fill(name);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

  // LOGIN PAGE
  await expect(page).toHaveURL('/login');
  await page.getByPlaceholder('Email or Username').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Log in', exact: true }).click();

  // DASHBOARD PAGE
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Latest Posts' })).toBeVisible();

  // SESSION LOSS
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.removeItem('user'));

  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('heading', { name: 'Log into Netlink', exact: true })).toBeVisible();
});