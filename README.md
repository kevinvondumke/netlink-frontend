# NETLINK — Frontend
Modern social platform for network engineers, built with Vue 3, Vite, Pinia, and the CYDERX Design System.

## Status
[![Netlink Frontend CI](https://github.com/kevinvondumke/netlink-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/kevinvondumke/netlink-frontend/actions/workflows/ci.yml)

## Tech Stack
- Vue 3 (Composition API)
- Vite
- TypeScript
- Pinia (state management)
- Vue Router
- TailwindCSS + CYDERX tokens
- Axios (API client)

## Project Structure
- src/
  - assets/
  - components/
  - views/
  - stores/
  - router/
  - api/
  - styles/
  - utils/

## Setup
npm install
npm run dev

## Environment Variables
Create a `.env` file:

VITE_API_URL=https://backend-url.com

## Design System
This project uses the CYDERX Design System:
- Color tokens
- Typography tokens
- Grid & layout system
- Component patterns

## Frontend testing

From the frontend repository root, install the application dependencies and the browser executables:

```sh
cd app
npm ci
npx playwright install chromium firefox webkit
```

Run the following commands from `app`:

| Task | Command |
| --- | --- |
| Run the Vitest suite | `npm test` |
| Run all Playwright projects headless | `npm run test:e2e` |
| Run Chromium only | `npm run test:e2e -- --project=chromium` |
| Watch a browser run | `npm run test:e2e:headed -- --project=chromium` |
| Step through the header login test in Inspector | `npm run test:e2e -- --project=chromium --debug --grep "Visitor opens the login page from the home header"` |
| Inspect the most recent HTML report | `npm run test:e2e:report` |

Playwright discovers specs in `app/e2e/` and runs them in Chromium, Firefox, and WebKit. The Week 12 suite covers four signed-out journeys: opening login or registration from the home header, visiting login directly, and returning home from an unknown URL. These checks can run with the frontend alone.

When starting Netlink, Playwright runs `npm run build` and serves the resulting production build with Vite preview. Both the readiness check and relative browser navigation use `http://127.0.0.1:4173`. Local runs can reuse an existing server at that address. Stop an old preview before testing a fresh build. CI settings require a fresh server, use one worker, and allow one retry.

The HTML report is written to `app/playwright-report/`. Failure screenshots go under `app/test-results/`. Both directories are ignored by Git. Future authenticated login, publishing, and logout checks will need a backend and isolated test accounts. Adding these browser checks to PR CI is a separate integration task.

## Deployment
This project is deployed via Netlify.

## License
MIT
