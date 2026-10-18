# CLAUDE.md

This project's canonical engineering context lives in [AGENTS.md](./AGENTS.md).
Claude Code loads it via the import below:

@AGENTS.md

## Quick Reference for Claude Code

### Primary Commands

- **Install dependencies**: `pnpm install`
- **Build monorepo**: `pnpm build`
- **Lint monorepo**: `pnpm lint`
- **Format monorepo**: `pnpm format`
- **Run unit tests (Vitest)**: `pnpm test`
- **Run API integration tests**: `docker compose -f docker-compose.test.yml up -d --wait` then `pnpm --filter server test:e2e`
- **Run end to end tests (Playwright)**: `pnpm --filter e2e test:e2e` (same infrastructure)
- **Client dev**: `pnpm --filter client dev`
- **Admin dev**: `pnpm --filter admin dev`
- **Server dev**: `pnpm --filter server dev`
- **Prisma generate**: `pnpm --filter @repo/prisma db:generate`
- **Prisma migrate (dev)**: `pnpm --filter @repo/prisma db:migrate:dev`

### Core Engineering Invariants

1. **Strict Monorepo Boundaries**: `apps/client` is public read-only; `apps/admin` is private CMS studio; `apps/server` is the single authoritative backend. Never let client or admin connect directly to PostgreSQL or Prisma.
2. **Real Data Only**: Never generate mock, stub, or fallback business data. The NestJS backend API is the single source of truth.
3. **Server-Side Security**: Never trust client-side role claims. Authorization is strictly enforced server-side via `RolesGuard` against database roles.
4. **Database Safety**: Never run `prisma migrate reset` in production. Keep Prisma schemas modularized under `packages/prisma/prisma/schema/*.prisma`.
5. **Types in one place**: Define every custom type (models, API shapes, props, inline prop objects) in `packages/types` and import it with `import type`. A Biome plugin fails `pnpm lint` on local types.
6. **Comments explain why**: Comment only where the reason is not obvious from the code (a security decision, a workaround, a non-obvious constraint), in one or two plain sentences. Never restate what the code does. Directive comments (`biome-ignore`, `@vitest-environment`, `/// <reference>`, shebangs, Dockerfile `# syntax=`) are always fine.
7. **Verification**: Always run `pnpm lint` and verify build status before marking any task as complete.
