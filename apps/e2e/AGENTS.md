# End to End Tests

## Overview

Playwright suite that drives the real public site (`apps/client`), admin studio (`apps/admin`) and API (`apps/server`) against throwaway Postgres, Redis and the Firebase Auth emulator. It also runs axe accessibility scans (WCAG 2.2 AA) on every public page.

## Key files

| File                          | Owns                                                                                               |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| apps/e2e/playwright.config.ts | Web servers (API, client, admin) with test env, projects (setup, client desktop and mobile, admin) |
| apps/e2e/env.ts               | URLs, infrastructure defaults, seeded accounts and content names                                   |
| apps/e2e/tests/seed.setup.ts  | Resets the database and emulator, then seeds accounts and content through the API                  |
| apps/e2e/fixtures/db.ts       | Test harness database access (reset, first admin) and a small API client                           |
| apps/e2e/fixtures/admin.ts    | Sign in through the real login form                                                                |
| docker-compose.test.yml       | Postgres 17, Redis 7 and the Auth emulator (`docker/firebase-emulator.Dockerfile`)                 |

## Commands

```bash
# Start the infrastructure (once)
docker compose -f docker-compose.test.yml up -d --wait

# Run the suite (builds and starts the API, client and admin itself)
pnpm --filter e2e test:e2e

# Debug interactively
pnpm --filter e2e test:e2e:ui

# Stop the infrastructure (data lives in tmpfs and is discarded)
docker compose -f docker-compose.test.yml down
```

## Conventions

- Tests share one database, so they run one at a time (`workers: 1`). Tests that change content use their own seeded records (for example `round-trip`), never the ones other specs assert on.
- Seed content through the API, so the public site gets it through on demand revalidation. Use `fixtures/db.ts` only for what no API call can do (reset, the first admin, media rows that would need S3).
- Prefer accessible queries (`getByRole`, `getByLabel`). A control that can't be found by role or label is an accessibility bug to fix in the app.

## Gotchas

- The emulator needs Java, so it runs in Docker; nothing needs installing on the host besides Docker and Playwright's browser (`pnpm --filter e2e exec playwright install chromium`).
- Locally, running servers are reused (`reuseExistingServer`). Stop them if you changed app code, or the suite tests the old build.
- `NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST` is set only here and in CI; it must never be set for a real deployment.

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
