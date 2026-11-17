import { test, expect } from '@playwright/test';

test('User can complete the full authentication lifecycle: register, login, view dashboard and logout', async ({ page }) => {
  // UNIQUE TEST USER
  const timestamp = Date.now();
  const email = `test_${timestamp}@netlink.local`;
  const randomSuffix = Math.random().toString(36).substring(2, 8).replace(/[0-9]/g, 'a');
  const name = `Test User ${randomSuffix}`;
  const password = `TestPassword123!`;

  // REGISTER
  await page.goto('/register');
  const registerHeading = page.getByRole('heading', { name: 'Get Started on Netlink', exact: true });
  const fullNameInput = page.getByPlaceholder('Full Name');
  const emailInput = page.getByPlaceholder('Email');
  const passwordInput = page.getByPlaceholder('Password');
  const signUpButton = page.getByRole('button', { name: 'Sign Up', exact: true });
  
  await expect(registerHeading).toBeVisible();
  await expect(signUpButton).toBeVisible();

  await fullNameInput.fill(name);
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await signUpButton.click();

  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('heading', { name: 'Log into Netlink', exact: true })).toBeVisible();

  // LOGIN
  const emailLoginInput = page.getByPlaceholder('Email or Username');
  const passwordLoginInput = page.getByPlaceholder('Password');
  const loginButton = page.getByRole('button', { name: 'Log in', exact: true });

  await emailLoginInput.fill(email);
  await passwordLoginInput.fill(password);
  await loginButton.click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

  const logoutButton = page.getByRole('button', { name: 'Logout' });
  await logoutButton.click();

  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('heading', { name: 'Log into Netlink', exact: true })).toBeVisible();
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
});

test('Registration rejects invalid email domain with visible validation feedback', async ({ page }) => {
  // REGISTRATION PAGE
  await page.goto('/register');

  await page.getByPlaceholder('Full Name').fill('Valid User Name');
  await page.getByPlaceholder('Email').fill('invalid@gmail.com');
  await page.getByPlaceholder('Password').fill('TestPassword123!');

  await expect(page.getByText("* Email must end with '@netlink.local'.")).toBeVisible();
  await page.getByRole('button', { name: 'Sign Up', exact: true }).click();
  await expect(page).toHaveURL('/register');
});

test('Login with invalid credentials displays error and keeps user unauthenticated', async ({ page }) => {
  // LOGIN PAGE
  await page.goto('/login');
  await page.getByPlaceholder('Email or Username').fill('invalid@netlink.local');
  await page.getByPlaceholder('Password').fill('WrongPassword123!');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();

  await expect(page.getByText('Invalid login credentials. Please try again.')).toBeVisible();
  await expect(page).toHaveURL('/login');
});