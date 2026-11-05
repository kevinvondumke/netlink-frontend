import { test, expect } from "@playwright/test";

test("Visitor opens the login page from the home header", async ({ page }) => {
  // HOME HEADING ASSERTION
  await page.goto("/");
  const homeHeading = page.getByRole("heading", {
    name: "Connect with intention. Publish with control.",
    exact: true,
  });
  await expect(homeHeading).toBeVisible();

  // SIGN IN LINK ASSERTION
  const signInLink = page
    .getByRole("banner")
    .getByRole("link", { name: "Sign In", exact: true });
  await expect(signInLink).toBeVisible();
  await signInLink.click();

  // URL BECOMES /LOGIN ASSERTION
  await expect(page).toHaveURL("/login");

  // LOGIN HEADING ASSERTION
  const loginHeading = page.getByRole("heading", {
    name: "Log into Netlink",
    exact: true,
  });
  await expect(loginHeading).toBeVisible();
});

test("Visitor opens the registration page from the home header", async ({
  page,
}) => {
  // HOME HEADING ASSERTION
  await page.goto("/");
  const homeHeading = page.getByRole("heading", {
    name: "Connect with intention. Publish with control.",
    exact: true,
  });
  await expect(homeHeading).toBeVisible();

  // SIGN UP LINK ASSERTION
  const signUpLink = page
    .getByRole("banner")
    .getByRole("link", { name: "Sign Up", exact: true });
  await expect(signUpLink).toBeVisible();
  await signUpLink.click();

  // URL BECOMES /register ASSERTION
  await expect(page).toHaveURL("/register");

  // REGISTER HEADING ASSERTION
  const registerHeading = page.getByRole("heading", {
    name: "Get Started on Netlink",
    exact: true,
  });
  await expect(registerHeading).toBeVisible();
});

test("A visitor opens /login directly and sees the login heading, credential fields, and Log in button", async ({
  page,
}) => {
  // LOGIN HEADING ASSERTION
  await page.goto("/login");
  const loginHeading = page.getByRole("heading", {
    name: "Log into Netlink",
    exact: true,
  });
  await expect(loginHeading).toBeVisible();

  // EMAIL NAME FIELD ASSERTION
  const emailField = page.getByPlaceholder("Email or Username");
  await expect(emailField).toBeVisible();

  // PASSWORD NAME FIELD ASSERTION
  const passwordField = page.getByPlaceholder("Password");
  await expect(passwordField).toBeVisible();

  // LOG IN BUTTON ASSERTION
  const logInButton = page.getByRole("button", { name: "Log in", exact: true });
  await expect(logInButton).toBeVisible();
});

test("Unauthenticated visitor returns home from an unknown route", async ({
  page,
}) => {
  // UNKNOWN 404 PAGE ASSERTION
  await page.goto("/missing-page-example");

  const lostNetworkHeading = page.getByRole("heading", {
    name: "Lost in the Network?",
    exact: true,
  });
  await expect(lostNetworkHeading).toBeVisible();

  // MISSING PATH ASSERTION
  const missingPathText = page.getByText("/missing-page-example", {
    exact: true,
  });
  await expect(missingPathText).toBeVisible();

  // BACK TO HOME LINK ASSERTION
  const backToHomeLink = page.getByRole("link", {
    name: "Back to Home",
    exact: true,
  });
  await expect(backToHomeLink).toBeVisible();
  await backToHomeLink.click();

  // URL BECOMES '/' ASSERTION
  await expect(page).toHaveURL("/");

  // HOME HEADING ASSERTION
  const homeHeading = page.getByRole("heading", {
    name: "Connect with intention. Publish with control.",
    exact: true,
  });
  await expect(homeHeading).toBeVisible();
});
