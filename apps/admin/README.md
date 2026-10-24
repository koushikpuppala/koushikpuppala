# Admin (Content Studio)

Private CMS for the portfolio. It signs in with Firebase Authentication and talks to `apps/server` over authenticated REST. Project conventions live in [AGENTS.md](./AGENTS.md).

## Getting Started

Copy the root `.env.example` to `apps/admin/.env` and fill in the API address and the Firebase web app config, then run the development server:

```bash
pnpm --filter admin dev
```

Browse [localhost:3001](http://localhost:3001) to see the result.

## Scripts

```bash
pnpm --filter admin build   # production build
pnpm --filter admin lint    # Biome lint
pnpm --filter admin test    # Vitest unit and component tests
```

End to end tests for the studio live in `apps/e2e`.

## Layout

```
app/            routes only
src/actions     API calls, one file per feature
src/components  shell, cms building blocks, and one folder per feature
src/constants   API base URL, navigation
src/lib         API client, auth, Firebase, theme, helpers
src/styles      global styles and design tokens
src/validations zod schemas
```
