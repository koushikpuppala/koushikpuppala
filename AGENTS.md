# Koushik Puppala Monorepo

## Overview

Monorepo for Koushik Puppala's digital presence, comprising a public portfolio website (`apps/client`), a private content management studio (`apps/admin`), an authoritative NestJS backend API (`apps/server`), and shared workspace packages (`packages/*`).

---

## Monorepo Layout & Workspace Boundaries

```text
├── apps/
│   ├── client/       # Public portfolio (Next.js 16.3.2 App Router, React 19.2.8, Tailwind CSS v4)
│   ├── admin/        # Private CMS studio (Next.js 16.3.2, React 19.2.8, TanStack Table v8, Tailwind CSS v4)
│   └── server/       # Authoritative REST API (NestJS 11.2.1, Express, Prisma 7.9.1, Redis, Firebase Admin)
├── packages/
│   ├── prisma/       # PostgreSQL 17 schema (modular schema/*.prisma), migrations, client (@repo/prisma)
│   ├── ui/           # Shared reusable UI component library (DataTable, Table, Tailwind v4) (ui)
│   ├── types/        # Shared TypeScript domain contracts, DTOs, and component prop types (types)
│   ├── utils/        # Shared helper functions (classNames, formatDate, useFormReducer) (utils)
│   └── config/       # Shared TypeScript presets (tsconfig.next.json, tsconfig.nest.json) (@repo/config)
├── docs/             # Technical documentation, agent workflow (agent-workflow.md), architecture diagrams
└── .github/          # GitHub Actions deployment workflows (production.yml, developement.yml)
```

### Boundary & Dependency Rules
* `apps/client` is public read-only. Never expose administration features, write endpoints, or privileged API keys.
* `apps/admin` owns content management workflows. It communicates with `apps/server` via authenticated REST endpoints.
* `apps/server` is the single authoritative backend and gateway to PostgreSQL, Redis, and AWS S3. Frontend applications must NEVER connect directly to the database or Prisma client.
* Shared packages (`packages/*`) must NOT import application-specific code from `apps/*`.
* Always use the pnpm workspace protocol (`workspace:*`) for inter-package dependencies. Never introduce circular dependencies.

---

## Stack & Tooling

* **Language & Runtime**: TypeScript 5.8 / Node.js 22.x
* **Package Manager**: pnpm (workspace protocol, `--filter` scoping)
* **Build System**: Turborepo 2.x
* **Frontend Framework**: Next.js 16.3.2 (App Router), React 19.2.8
* **Backend Framework**: NestJS 11.2.1 (Express platform)
* **Database & ORM**: PostgreSQL 17, Prisma 7.9.1 (modular schemas in `packages/prisma/prisma/schema/*.prisma`)
* **Cache & Session Store**: Redis (`ioredis`)
* **Authentication**: Firebase Authentication (client SDK in admin, Firebase Admin SDK in server)
* **Asset Storage**: AWS S3 (server-generated presigned upload and read URLs via `@aws-sdk/client-s3`)
* **Styling & Design**: Tailwind CSS v4, Motion, Headless UI, Heroicons, Lucide React
* **Linting & Formatting**: Biome (`biome lint`, `biome check`), Prettier (`prettier-plugin-tailwindcss`)
* **Observability**: Sentry (`@sentry/nextjs`, `@sentry/nestjs`), Winston structured rotating logs
* **Deployment**: Docker multi-stage build, GitHub Actions, AWS EC2 (SSH deployment)

---

## Build Approach

**Tracer Bullet**: vertical end-to-end slices, thin but complete through every layer (database → backend API → shared types → UI components → application views).

---

## Applicable Skills

The following installed agent skills have been selected based on direct alignment with this repository's codebase and architecture:

### Monorepo & Tooling
* [turborepo](~/.agents/skills/turborepo/): Monorepo task pipeline orchestration (`turbo.json`), caching strategies, and dependency graph execution.
* [pnpm](~/.agents/skills/pnpm/): Workspace package management, dependency isolation, catalog management, and filtered executions (`--filter`).
* [typescript](~/.agents/skills/typescript/): Strict type safety, shared module contracts, and clean TypeScript idioms across packages.

### Frontend (`apps/client` & `apps/admin`)
* [nextjs-app-router-patterns](~/.agents/skills/nextjs-app-router-patterns/): Next.js 16 App Router architecture, Server Components (RSC), route handlers, streaming, and Suspense boundaries.
* [react-patterns](~/.agents/skills/react-patterns/): React 19 component patterns, Server/Client Component boundaries, hook discipline, and form actions.
* [tailwindcss](~/.agents/skills/tailwindcss/): Tailwind CSS v4 utility-first styling, CSS custom properties, and responsive layout patterns.
* [tailwind-design-system](~/.agents/skills/tailwind-design-system/): Design tokens, theme consistency, and shared component styling across client and admin.
* [design-taste-frontend](~/.agents/skills/design-taste-frontend/): Anti-slop standards for clean, intentional portfolios and content studio interfaces.
* [uncodixfy](~/.agents/skills/uncodixfy/): Eliminates generic AI-generated interface tropes, enforcing human-designed polish and density.
* [web-design-guidelines](~/.agents/skills/web-design-guidelines/): Web design best practices, UI consistency, micro-interactions, and visual audit standards.
* [frontend-a11y](~/.agents/skills/frontend-a11y/): WCAG 2.2 Level AA accessibility, semantic HTML, ARIA patterns, and keyboard navigation.

### Backend (`apps/server`)
* [nestjs-best-practices](~/.agents/skills/nestjs-best-practices/): NestJS 11 modular architecture, dependency injection, and service boundaries.
* [nestjs-patterns](~/.agents/skills/nestjs-patterns/): Controllers, providers, DTO validation with `class-validator`, guards, interceptors, and exception filters.
* [api-design](~/.agents/skills/api-design/): RESTful API resource modeling, semantic HTTP status codes, structured errors, and pagination standards.
* [auth-implementation-patterns](~/.agents/skills/auth-implementation-patterns/): Firebase ID token Bearer verification, active session tracking, and RBAC guards.
* [redis-best-practices](~/.agents/skills/redis-best-practices/): Redis connection management, caching strategies, and intentional cache invalidation.

### Database & ORM (`packages/prisma`)
* [prisma](~/.agents/skills/prisma/): Prisma 7 schema modeling, relational querying, and Prisma Client generation.
* [prisma-patterns](~/.agents/skills/prisma-patterns/): Query optimization, relation handling, transaction safety, and avoiding serverless connection exhaustion.
* [postgresql-best-practices](~/.agents/skills/postgresql-best-practices/): PostgreSQL 17 relational database design, indexing strategies, constraints, and data integrity.
* [database-migrations](~/.agents/skills/database-migrations/): Safe migration workflows, schema evolution, and zero-downtime database updates.

### DevOps, Observability & Verification
* [sentry](~/.agents/skills/sentry/): Sentry error tracking, breadcrumbs, and performance monitoring integration.
* [docker-patterns](~/.agents/skills/docker-patterns/): Multi-stage Docker containerization, security hardening (non-root user), and production image optimization.
* [verification-loop](~/.agents/skills/verification-loop/): Systematic verification loop (linting, type-checking, building, testing) before concluding changes.

*(Note: Generic `frontend-design` was excluded in favor of the more specialized `design-taste-frontend` + `uncodixfy` pairing to avoid redundancy).*

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

# Run test suite across packages (Turbo)
pnpm test
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
* Keep strict application boundaries:
  * `apps/client` is public read-only.
  * `apps/admin` owns content management and administrative workflows.
  * `apps/server` is the authoritative backend and sole gateway to PostgreSQL, Redis, and S3.
* Never bypass the backend: frontend applications must never connect directly to PostgreSQL or initialize Prisma client.
* Shared domain contracts, DTOs, and component interfaces belong in `packages/types`.
* Reusable cross-application presentation components belong in `packages/ui`.
* Pure utility helpers belong in `packages/utils`.

### 2. Development Workflow & Agent Discipline
* **Inspect first**: examine existing code, architecture, and contracts before modifying anything.
* **Smallest correct change**: make minimal, surgical edits. Avoid sprawling or speculative refactors.
* **Preserve existing behavior**: do not break established functionality unless explicitly instructed.
* **Reuse existing abstractions**: check `packages/ui`, `packages/utils`, and domain services before introducing new components or helpers.
* **Real data only**: NEVER introduce mock, stub, or fallback business data when backend endpoints are unavailable. Fix or implement the real contract.
* **Honest reporting**: verify changes thoroughly and report any validation or build failures accurately.

### 3. TypeScript & Type Safety
* Enforce strict type safety across all packages. Avoid `any`, loose type assertions, or `@ts-ignore`.
* Define explicit return types on server services and API controller endpoints.
* Leverage TypeScript path aliases defined in package configurations (e.g., `@/components`, `@repo/prisma`, `types`, `ui`, `utils`).

### 4. Frontend Standards (`apps/client` & `apps/admin`)
* Prefer React Server Components (RSC) for data fetching and static markup.
* Use Client Components (`'use client'`) only for user interaction, local state, browser APIs, or custom event handlers.
* Admin styling must follow the public application (`apps/client`) design language, typography hierarchy, and spacing system while remaining optimized for CMS density.
* Reuse shared `DataTable` and table toolbar patterns from `packages/ui` rather than creating ad-hoc search and filter controls.
* Keep admin navigation and sidebar fixed; page content scrolls within the main viewport.
* Adhere to WCAG 2.2 Level AA accessibility: proper ARIA roles, keyboard focus management, and semantic HTML elements.

### 5. Backend Standards (`apps/server`)
* Follow NestJS modular structure: each domain feature encapsulates its own module, controller, service, and DTOs.
* Controllers handle HTTP routing, request parsing, and response status; services contain business logic.
* Validate all incoming request payloads using `class-validator` and `class-transformer` via global `ValidationPipe`.
* Standardize API responses using `ResponseInterceptor` and centralized exception filters.

### 6. Authentication, Authorization & Security
* **Server-side authentication**: all protected endpoints verify Firebase ID Bearer tokens via Firebase Admin SDK in `FirebaseAuthGuard`.
* **Server-side authorization (RBAC)**: `RolesGuard` strictly inspects database roles (`user.role === UserRole.ADMIN`). Client-side role checks are visual UI conveniences only.
* **Session revocation**: verify active sessions against Redis/PostgreSQL via `SessionService.isSessionRevoked(token)`.
* **Secrets management**: never commit secrets, `.env` files, or service account credentials to git. All production secrets are managed via GitHub Actions Secrets and environment variables.
* **Log redaction**: Winston logging interceptors must NEVER log authorization headers, passwords, bearer tokens, or sensitive payload data.
* **SQL Injection protection**: all database interactions must use Prisma 7 parameterized queries. Raw unescaped SQL queries are strictly prohibited.
* **Safe S3 handling**: files are uploaded and accessed via server-generated presigned S3 URLs with strict expiration TTLs. Validate file MIME types and size limits before upload.
* **Redis failure resilience**: Redis serves strictly as a performance accelerator and session cache. `CacheService.remember()` must gracefully degrade to direct PostgreSQL queries if Redis is unavailable.
* **Container security**: production Docker container runs as non-root user `portfolio:koushikpuppala` (UID 1001).

### 7. Database Safety (`packages/prisma` -> `@repo/prisma`)
* PostgreSQL is the persistent source of truth.
* Prisma schemas are modularized under `packages/prisma/prisma/schema/*.prisma`. Keep models logically separated by domain.
* Generate Prisma client (`pnpm --filter @repo/prisma db:generate`) after any schema changes.
* Migrations: apply development migrations via `pnpm --filter @repo/prisma db:migrate:dev`. NEVER execute `prisma migrate reset` in production or on shared databases.
* Atomicity: use Prisma `$transaction` for operations requiring multi-table atomicity.
* Query optimization: avoid N+1 queries by using Prisma `include` / `select` relations; ensure indexes exist on foreign keys, status fields, and sorted columns.

### 8. Testing & Verification
* Run `pnpm lint` and verify builds before submitting changes.
* Verify workspace compilation and ensure zero regressions across dependent packages.
* Write unit and integration tests using `@nestjs/testing` and Jest for backend business logic.

### 9. Git & Deployment
* Branch naming follows standard prefixes (`revamp/*`, `feat/*`, `fix/*`, `chore/*`).
* Continuous integration runs via GitHub Actions (`.github/workflows/production.yml`), building multi-stage Docker images and deploying to AWS EC2 via SSH.
* Never push broken builds or bypass CI verification.

---

## Context Files

* [apps/client/AGENTS.md](apps/client/AGENTS.md): Public portfolio website instructions and presentation boundaries
* [apps/admin/AGENTS.md](apps/admin/AGENTS.md): Private CMS and administration application instructions and UI standards
* [apps/server/AGENTS.md](apps/server/AGENTS.md): Authoritative NestJS backend instructions and API architecture
* [packages/prisma/AGENTS.md](packages/prisma/AGENTS.md): Prisma 7 and PostgreSQL database integration rules
* [packages/ui/AGENTS.md](packages/ui/AGENTS.md): Reusable UI components and design system guidelines
* [packages/types/AGENTS.md](packages/types/AGENTS.md): Shared domain contracts and API types
* [packages/utils/AGENTS.md](packages/utils/AGENTS.md): Shared utility helper functions
* [packages/config/AGENTS.md](packages/config/AGENTS.md): Shared tooling and TypeScript configurations
* [docs/agent-workflow.md](docs/agent-workflow.md): AI agent engineering workflow, philosophy, and core lifecycle loops

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
