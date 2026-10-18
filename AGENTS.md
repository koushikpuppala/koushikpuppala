# Koushik Puppala Monorepo

## Overview

Monorepo for Koushik Puppala's digital presence, comprising a public portfolio website (`apps/client`), a private content management studio (`apps/admin`), an authoritative NestJS backend API (`apps/server`), and shared workspace packages (`packages/*`).

---

## Monorepo Layout & Workspace Boundaries

```text
├── apps/
│   ├── client/       # Public portfolio (Next.js 16.4 App Router, React 19.3, Tailwind CSS v4)
│   ├── admin/        # Private CMS studio (Next.js 16.4, React 19.3, TanStack Table v9, Tailwind CSS v4)
│   ├── server/       # Authoritative REST API (NestJS 12.1, Express, Prisma 7.10, Redis, Firebase Admin)
│   └── e2e/          # Playwright end to end suite with axe checks (WCAG 2.2 AA)
├── packages/
│   ├── prisma/       # PostgreSQL 17 schema (modular schema/*.prisma), migrations, client (@repo/prisma)
│   ├── ui/           # Shared reusable UI component library (DataTable, Table, Tailwind v4) (ui)
│   ├── types/        # Shared TypeScript domain contracts, DTOs, and component prop types (types)
│   ├── utils/        # Shared helper functions (classNames, formatDate, useFormReducer) (utils)
│   └── config/       # Shared TypeScript presets (tsconfig.next.json, tsconfig.nest.json) (@repo/config)
├── docker/           # One multi-stage Dockerfile per app, server entrypoint, Firebase emulator image
├── docs/             # Technical documentation, agent workflow (agent-workflow.md), architecture diagrams
└── .github/          # GitHub Actions workflows (test.yml, production.yml, developement.yml)
```

### Boundary & Dependency Rules

- `apps/client` is public read-only. Never expose administration features, write endpoints, or privileged API keys.
- `apps/admin` owns content management workflows. It communicates with `apps/server` via authenticated REST endpoints.
- `apps/server` is the single authoritative backend and gateway to PostgreSQL, Redis, and AWS S3. Frontend applications must NEVER connect directly to the database or Prisma client.
- Shared packages (`packages/*`) must NOT import application-specific code from `apps/*`.
- Always use the pnpm workspace protocol (`workspace:*`) for inter-package dependencies. Never introduce circular dependencies.

---

## Stack & Tooling

- **Language & Runtime**: TypeScript 7.0 (apps/server stays on 6.0 until Nest CLI supports 7, see apps/server/AGENTS.md) / Node.js 22.x
- **Package Manager**: pnpm 12.14 (workspace protocol, `--filter` scoping)
- **Build System**: Turborepo 2.x
- **Frontend Framework**: Next.js 16.4 (App Router), React 19.3
- **Backend Framework**: NestJS 12.1 (Express platform)
- **Database & ORM**: PostgreSQL 17, Prisma 7.10 (modular schemas in `packages/prisma/prisma/schema/*.prisma`)
- **Cache & Session Store**: Redis (`ioredis`)
- **Authentication**: Firebase Authentication (client SDK in admin, Firebase Admin SDK in server)
- **Asset Storage**: AWS S3 (server-generated presigned upload and read URLs via `@aws-sdk/client-s3`)
- **Styling & Design**: Tailwind CSS v4, Motion, Headless UI, Heroicons, Lucide React
- **Linting & Formatting**: Biome (`biome lint`, `biome check`), Prettier (`prettier-plugin-tailwindcss`)
- **Observability**: Sentry (`@sentry/nextjs`, `@sentry/nestjs`), Winston structured rotating logs
- **Deployment**: one multi-stage Dockerfile per app in `docker/` (`client.Dockerfile`, `admin.Dockerfile`, `server.Dockerfile`), built from the repository root with `docker build -f docker/<app>.Dockerfile .` and pruned with `turbo prune <app> --docker`. Settings come from the root `.env`, copied into each image (CI writes it from the `ENV_FILE` secret); the server entrypoint (`docker/entrypoint.server.sh`) runs `prisma migrate deploy` before starting. Every image has a Docker `HEALTHCHECK` on `GET /api/health` (the API's health module; `app/api/health/route.ts` in client and admin, a liveness check that does not call the API). GitHub Actions, AWS EC2 (SSH deployment)

---

## Build Approach

**Tracer Bullet**: vertical end-to-end slices, thin but complete through every layer (database → backend API → shared types → UI components → application views).

---

## Applicable Skills

The following installed agent skills have been selected based on direct alignment with this repository's codebase and architecture:

### Monorepo & Tooling

- [turborepo](~/.agents/skills/turborepo/): Monorepo task pipeline orchestration (`turbo.json`), caching strategies, and dependency graph execution.
- [pnpm](~/.agents/skills/pnpm/): Workspace package management, dependency isolation, catalog management, and filtered executions (`--filter`).
- [typescript](~/.agents/skills/typescript/): Strict type safety, shared module contracts, and clean TypeScript idioms across packages.

### Frontend (`apps/client` & `apps/admin`)

- [nextjs-app-router-patterns](~/.agents/skills/nextjs-app-router-patterns/): Next.js 16 App Router architecture, Server Components (RSC), route handlers, streaming, and Suspense boundaries.
- [react-patterns](~/.agents/skills/react-patterns/): React 19 component patterns, Server/Client Component boundaries, hook discipline, and form actions.
- [tailwindcss](~/.agents/skills/tailwindcss/): Tailwind CSS v4 utility-first styling, CSS custom properties, and responsive layout patterns.
- [tailwind-design-system](~/.agents/skills/tailwind-design-system/): Design tokens, theme consistency, and shared component styling across client and admin.
- [design-taste-frontend](~/.agents/skills/design-taste-frontend/): Anti-slop standards for clean, intentional portfolios and content studio interfaces.
- [uncodixfy](~/.agents/skills/uncodixfy/): Eliminates generic AI-generated interface tropes, enforcing human-designed polish and density.
- [web-design-guidelines](~/.agents/skills/web-design-guidelines/): Web design best practices, UI consistency, micro-interactions, and visual audit standards.
- [frontend-a11y](~/.agents/skills/frontend-a11y/): WCAG 2.2 Level AA accessibility, semantic HTML, ARIA patterns, and keyboard navigation.

### Backend (`apps/server`)

- [nestjs-best-practices](~/.agents/skills/nestjs-best-practices/): NestJS 12 modular architecture, dependency injection, and service boundaries.
- [nestjs-patterns](~/.agents/skills/nestjs-patterns/): Controllers, providers, DTO validation with `class-validator`, guards, interceptors, and exception filters.
- [api-design](~/.agents/skills/api-design/): RESTful API resource modeling, semantic HTTP status codes, structured errors, and pagination standards.
- [auth-implementation-patterns](~/.agents/skills/auth-implementation-patterns/): Firebase ID token Bearer verification, active session tracking, and RBAC guards.
- [redis-best-practices](~/.agents/skills/redis-best-practices/): Redis connection management, caching strategies, and intentional cache invalidation.

### Database & ORM (`packages/prisma`)

- [prisma](~/.agents/skills/prisma/): Prisma 7 schema modeling, relational querying, and Prisma Client generation.
- [prisma-patterns](~/.agents/skills/prisma-patterns/): Query optimization, relation handling, transaction safety, and avoiding serverless connection exhaustion.
- [postgresql-best-practices](~/.agents/skills/postgresql-best-practices/): PostgreSQL 17 relational database design, indexing strategies, constraints, and data integrity.
- [database-migrations](~/.agents/skills/database-migrations/): Safe migration workflows, schema evolution, and zero-downtime database updates.

### DevOps, Observability & Verification

- [sentry](~/.agents/skills/sentry/): Sentry error tracking, breadcrumbs, and performance monitoring integration.
- [docker-patterns](~/.agents/skills/docker-patterns/): Multi-stage Docker containerization, security hardening (non-root user), and production image optimization.
- [verification-loop](~/.agents/skills/verification-loop/): Systematic verification loop (linting, type-checking, building, testing) before concluding changes.

_(Note: Generic `frontend-design` was excluded in favor of the more specialized `design-taste-frontend` + `uncodixfy` pairing to avoid redundancy)._

---

## Commands

### Workspace-Wide Commands

```bash
# Install dependencies
pnpm install

# Run all applications in development mode (Turbo)
pnpm dev

# Build all applications and packages (Turbo)
pnpm build

# Lint all packages using Biome (Turbo)
pnpm lint

# Format code across the monorepo using Prettier
pnpm format

# Unit and component tests across packages (Vitest, via Turbo)
pnpm test

# Throwaway Postgres, Redis and Firebase Auth emulator for the tests below
docker compose -f docker-compose.test.yml up -d --wait

# API integration tests against that infrastructure
pnpm --filter server test:e2e

# End to end tests (Playwright starts the API, client and admin itself)
pnpm --filter e2e test:e2e
```

### Application-Scoped Commands

```bash
# Client (Public Portfolio)
pnpm --filter client dev
pnpm --filter client build
pnpm --filter client lint
pnpm --filter client check

# Admin (CMS Studio)
pnpm --filter admin dev
pnpm --filter admin build
pnpm --filter admin lint
pnpm --filter admin check

# Server (NestJS API)
pnpm --filter server dev            # Starts server in watch mode (nest start --watch)
pnpm --filter server build          # Builds server output to dist/ (nest build)
pnpm --filter server lint           # Lints server code using Biome
pnpm --filter server start:debug    # Starts server in debug mode with watch
```

### Database Commands (`packages/prisma` -> `@repo/prisma`)

```bash
# Generate Prisma Client
pnpm --filter @repo/prisma db:generate

# Run development migrations
pnpm --filter @repo/prisma db:migrate:dev

# Deploy migrations in production / CI
pnpm --filter @repo/prisma db:migrate:deploy

# Push schema changes directly without migrations (dev prototyping only)
pnpm --filter @repo/prisma db:push

# Seed database
pnpm --filter @repo/prisma db:seed

# Open Prisma Studio GUI
pnpm --filter @repo/prisma db:studio

# Format Prisma schema files
pnpm --filter @repo/prisma db:format
```

### Package Type-Checking

```bash
# Type-check UI package
pnpm --filter ui check-types

# Type-check Utils package
pnpm --filter utils check-types
```

---

## Engineering Rules

### 1. Architecture & Monorepo Boundaries

- Keep strict application boundaries:
  - `apps/client` is public read-only.
  - `apps/admin` owns content management and administrative workflows.
  - `apps/server` is the authoritative backend and sole gateway to PostgreSQL, Redis, and S3.
- Never bypass the backend: frontend applications must never connect directly to PostgreSQL or initialize Prisma client.
- Every custom type lives in `packages/types`, the single source of truth: domain models, API shapes, enums, and component props, including inline prop objects (`({ title }: { title: string })` becomes a named `XProps`). Apps and packages import them with `import type`. `biome/no-local-type-declaration.grit` fails `pnpm lint` on any `type`, `interface`, `enum` or object type elsewhere; the only exceptions are tests, generated code, `environment.d.ts`, the server's Express augmentation and the Prisma seed script (see packages/types/AGENTS.md).
- Reusable cross-application presentation components belong in `packages/ui`.
- Pure utility helpers belong in `packages/utils`.

### 2. Development Workflow & Agent Discipline

- **Inspect first**: examine existing code, architecture, and contracts before modifying anything.
- **Smallest correct change**: make minimal, surgical edits. Avoid sprawling or speculative refactors.
- **No comments in code**: write no comments in source, config, CSS, workflows or Dockerfiles; add one only when the owner asks for it. Directive comments that change behaviour are the exception: `// biome-ignore`, `// @vitest-environment`, `/// <reference>`, shebangs and Dockerfile `# syntax=`. `.env.example` keeps its `# description` lines.
- **Preserve existing behavior**: do not break established functionality unless explicitly instructed.
- **Reuse existing abstractions**: check `packages/ui`, `packages/utils`, and domain services before introducing new components or helpers.
- **Real data only**: NEVER introduce mock, stub, or fallback business data when backend endpoints are unavailable. Fix or implement the real contract.
- **Honest reporting**: verify changes thoroughly and report any validation or build failures accurately.

### 3. TypeScript & Type Safety

- Enforce strict type safety across all packages. Avoid `any`, loose type assertions, or `@ts-ignore`.
- Define explicit return types on server services and API controller endpoints.
- Write functions and components as `const` arrow functions, never `function` declarations. Default exports go at the end of the file: `const HomePage = async () => { ... }` then `export default HomePage`. Named exports use `export const X = () => { ... }`. This also applies to function expressions, callbacks and inline scripts. Class methods (Nest controllers and services) are the only exception. `biome/no-function-declaration.grit` (a Biome plugin wired into `biome.json`) fails `pnpm lint` on any `function` keyword.
- Import only what you use, never a namespace: `import { useState, type ReactNode } from 'react'`, `import { init } from '@sentry/nextjs'`. Not `import * as React` or `React.X`. Import types with `type`. When a React event type collides with a DOM global (`KeyboardEvent`, `MouseEvent`), alias it (`type KeyboardEvent as ReactKeyboardEvent`). Biome's `performance/noNamespaceImport` enforces this.
- Use `Link` from `next/link` for every link, never a raw `<a>`. This includes external URLs (`target='_blank'`, `rel='noopener noreferrer'`), `mailto:` and `#hash` links. `Link` needs a defined `href`, so render it conditionally when the URL is optional. `biome/no-anchor-element.grit` enforces this.
- Leverage TypeScript path aliases defined in package configurations (e.g., bare `components/...` and `lib/...` inside both Next apps, `@repo/prisma`, `types`, `ui`, `utils`).

### 4. Frontend Standards (`apps/client` & `apps/admin`)

- Prefer React Server Components (RSC) for data fetching and static markup.
- Use Client Components (`'use client'`) only for user interaction, local state, browser APIs, or custom event handlers.
- Admin styling must follow the public application (`apps/client`) design language, typography hierarchy, and spacing system while remaining optimized for CMS density. Typefaces are the one intentional difference: the client uses Geist (body), Bricolage Grotesque (headings) and Geist Mono, while the admin uses Plus Jakarta Sans for everything, mono included, with tabular numerals on former mono text and tables. Don't align them.
- Reuse shared `DataTable` and table toolbar patterns from `packages/ui` rather than creating ad-hoc search and filter controls.
- Keep admin navigation and sidebar fixed; page content scrolls within the main viewport.
- Adhere to WCAG 2.2 Level AA accessibility: proper ARIA roles, keyboard focus management, and semantic HTML elements.
- Focus rings show for keyboard users only: style them with the `focus-ring:` variant from `packages/ui/style.css`, never `focus:` or `focus-visible:`.

### 5. Backend Standards (`apps/server`)

- Follow NestJS modular structure: each domain feature encapsulates its own module, controller, service, and DTOs.
- Controllers handle HTTP routing, request parsing, and response status; services contain business logic.
- Validate all incoming request payloads using `class-validator` and `class-transformer` via global `ValidationPipe`.
- Standardize API responses using `ResponseInterceptor` and centralized exception filters.

### 6. Authentication, Authorization & Security

- **Server-side authentication**: all protected endpoints verify Firebase ID Bearer tokens via Firebase Admin SDK in `FirebaseAuthGuard`.
- **Server-side authorization (RBAC)**: `RolesGuard` strictly inspects database roles (`user.role === UserRole.ADMIN`). Client-side role checks are visual UI conveniences only.
- **Session revocation**: verify active sessions against Redis/PostgreSQL via `SessionService.isSessionRevoked(token)`.
- **Secrets management**: never commit secrets, `.env` files, or service account credentials to git. All production secrets are managed via GitHub Actions Secrets and environment variables.
- **No config defaults in code**: every setting (URLs, ports, pool sizes, regions, bucket names, Sentry org and project) comes from the environment, with no fallback literal. A missing value fails at startup or build with `Missing environment variable: NAME`: the server through `Configuration.required()`, the Next apps through `requireEnv()` from `utils/requireEnv`. Only opt-in flags (`REDIS_TLS`) and optional integrations (Sentry, revalidation) may be unset. Test fixtures (`apps/server/test/env.ts`, `apps/e2e`) hold their own values for the throwaway test stack.
- **One `.env.example`**: the root `.env.example` is the single source of truth and documents every variable each app reads, as `# description` then `KEY = "value"`, with no real secrets. There are no per-app examples; the same `.env` is placed in each app that reads one (`apps/server`, `apps/client`, `apps/admin`, `packages/prisma`), locally and in the Docker images. dotenv (Nest, Prisma) and Next.js parse this format; `docker run --env-file` does not (it keeps the spaces and quotes), so the images copy `.env` instead.
- **Log redaction**: Winston logging interceptors must NEVER log authorization headers, passwords, bearer tokens, or sensitive payload data.
- **SQL Injection protection**: all database interactions must use Prisma 7 parameterized queries. Raw unescaped SQL queries are strictly prohibited.
- **Safe S3 handling**: files are uploaded and accessed via server-generated presigned S3 URLs with strict expiration TTLs. Validate file MIME types and size limits before upload.
- **Redis failure resilience**: Redis serves strictly as a performance accelerator and session cache. `CacheService.remember()` must gracefully degrade to direct PostgreSQL queries if Redis is unavailable.
- **Container security**: production Docker container runs as non-root user `portfolio:koushikpuppala` (UID 1001).

### 7. Database Safety (`packages/prisma` -> `@repo/prisma`)

- PostgreSQL is the persistent source of truth.
- Prisma schemas are modularized under `packages/prisma/prisma/schema/*.prisma`. Keep models logically separated by domain.
- Generate Prisma client (`pnpm --filter @repo/prisma db:generate`) after any schema changes.
- Migrations: apply development migrations via `pnpm --filter @repo/prisma db:migrate:dev`. NEVER execute `prisma migrate reset` in production or on shared databases.
- Atomicity: use Prisma `$transaction` for operations requiring multi-table atomicity.
- Query optimization: avoid N+1 queries by using Prisma `include` / `select` relations; ensure indexes exist on foreign keys, status fields, and sorted columns.

### 8. Testing & Verification

- Run `pnpm lint` and verify builds before submitting changes.
- Verify workspace compilation and ensure zero regressions across dependent packages.
- Test layers (all run in CI through `.github/workflows/test.yml` before any image is built):

| Layer           | Tool                                                 | Where                                                                                                                            |
| --------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Unit            | Vitest                                               | `*.spec.ts` (server), `*.test.ts(x)` (other packages)                                                                            |
| Component       | Vitest + React Testing Library + jsdom, MSW for HTTP | `apps/admin`, `apps/client`, `packages/ui`, `packages/utils`                                                                     |
| Contract        | Vitest                                               | `apps/server/src/common/dto-*.spec.ts`: admin `DTO_FIELDS` (packages/types) equal the server DTOs; Update DTOs carry no defaults |
| API integration | Vitest + `@nestjs/testing` + supertest               | `apps/server/test/*.e2e-spec.ts`, real Postgres, Redis and Auth emulator                                                         |
| End to end      | Playwright + axe (WCAG 2.2 AA)                       | `apps/e2e`                                                                                                                       |

- Never mock what an integration or end to end test can exercise for real; MSW mocks are for component tests only.

### 9. Git & Deployment

- Branch naming follows standard prefixes (`revamp/*`, `feat/*`, `fix/*`, `chore/*`).
- Continuous integration runs via GitHub Actions (`.github/workflows/production.yml`), building the `client`, `admin` and `server` Docker targets, pushing them to Amazon ECR (`<ECR_REPOSITORY_PREFIX>/<app>`), and deploying to AWS EC2 via SSH.
- Never push broken builds or bypass CI verification.

---

## Context Files

- [apps/client/AGENTS.md](apps/client/AGENTS.md): Public portfolio website instructions and presentation boundaries
- [apps/admin/AGENTS.md](apps/admin/AGENTS.md): Private CMS and administration application instructions and UI standards
- [apps/server/AGENTS.md](apps/server/AGENTS.md): Authoritative NestJS backend instructions and API architecture
- [packages/prisma/AGENTS.md](packages/prisma/AGENTS.md): Prisma 7 and PostgreSQL database integration rules
- [packages/ui/AGENTS.md](packages/ui/AGENTS.md): Reusable UI components and design system guidelines
- [packages/types/AGENTS.md](packages/types/AGENTS.md): Shared domain contracts and API types
- [packages/utils/AGENTS.md](packages/utils/AGENTS.md): Shared utility helper functions
- [packages/config/AGENTS.md](packages/config/AGENTS.md): Shared tooling and TypeScript configurations
- [docs/agent-workflow.md](docs/agent-workflow.md): AI agent engineering workflow, philosophy, and core lifecycle loops
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md): Team onboarding guide and project overview
- [apps/e2e/AGENTS.md](apps/e2e/AGENTS.md): Playwright end to end suite, fixtures, and test infrastructure

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
