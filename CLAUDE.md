# CLAUDE.md

This project's canonical engineering context lives in [AGENTS.md](./AGENTS.md).
Claude Code loads it via the import below:

@AGENTS.md

## Quick Reference for Claude Code

### Primary Commands
* **Install dependencies**: `pnpm install`
* **Build monorepo**: `pnpm build`
* **Lint monorepo**: `pnpm lint`
* **Format monorepo**: `pnpm format`
* **Run test suite**: `pnpm test`
* **Client dev**: `pnpm --filter client dev`
* **Admin dev**: `pnpm --filter admin dev`
* **Server dev**: `pnpm --filter server dev`
* **Prisma generate**: `pnpm --filter @repo/prisma db:generate`
* **Prisma migrate (dev)**: `pnpm --filter @repo/prisma db:migrate:dev`

### Core Engineering Invariants
1. **Strict Monorepo Boundaries**: `apps/client` is public read-only; `apps/admin` is private CMS studio; `apps/server` is the single authoritative backend. Never let client or admin connect directly to PostgreSQL or Prisma.
2. **Real Data Only**: Never generate mock, stub, or fallback business data. The NestJS backend API is the single source of truth.
3. **Server-Side Security**: Never trust client-side role claims. Authorization is strictly enforced server-side via `RolesGuard` against database roles.
4. **Database Safety**: Never run `prisma migrate reset` in production. Keep Prisma schemas modularized under `packages/prisma/prisma/schema/*.prisma`.
5. **Verification**: Always run `pnpm lint` and verify build status before marking any task as complete.
