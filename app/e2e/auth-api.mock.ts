import type { Page, Route } from "@playwright/test";
const registeredUsers = new Map<string, { name: string; password: string }>();
async function fulfill(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}
export async function mockAuthApi(page: Page) {
  await page.route("http://127.0.0.1:4400/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();
    if (method === "POST" && path === "/auth/register") {
      const body = request.postDataJSON() as {
        email: string;
        name: string;
        password: string;
      };
      registeredUsers.set(body.email, {
        name: body.name,
        password: body.password,
      });
      await fulfill(route, 201, { message: "Registration successful" });
      return;
    }
    if (method === "POST" && path === "/auth/login") {
      const body = request.postDataJSON() as {
        email: string;
        password: string;
      };
      const registered = registeredUsers.get(body.email);
      if (!registered || registered.password !== body.password) {
        await fulfill(route, 401, { message: "Invalid credentials" });
        return;
      }
      await fulfill(route, 200, {
        user: {
          id: 1,
          name: registered.name,
          username: body.email.split("@")[0],
          email: body.email,
        },
      });
      return;
    }
    if (method === "POST" && path === "/auth/logout") {
      await fulfill(route, 200, { message: "Logout successful" });
      return;
    }
    if (path === "/favorites") {
      await fulfill(route, 200, { users: [] });
      return;
    }
    if (path.includes("/suggested")) {
      await fulfill(route, 200, { users: [] });
      return;
    }
    if (path.startsWith("/post/")) {
      await fulfill(route, 200, { posts: [], nextCursor: null });
      return;
    }
    if (path === "/messages/unread") {
      await fulfill(route, 200, 0);
      return;
    }
    if (method === "GET") {
      await fulfill(route, 200, path.includes("favorite") ? { users: [] } : []);
      return;
    }
    await fulfill(route, 200, {});
  });
}
