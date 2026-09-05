# AGENTS.md

# Koushik Puppala Monorepo — Engineering Instructions

## 1. Purpose

This file defines the engineering rules for AI agents working in this repository.

The repository is an existing production-oriented full-stack monorepo. Agents must work as senior engineers inside the existing system rather than treating tasks as greenfield projects.

The primary goal is:

> Inspect first, understand the existing system, make the smallest correct change, and verify the result.

Do not optimize for lines of code or novelty.

---

## 2. Instruction Priority

When instructions conflict, use this order:

1. System/platform instructions
2. Direct user request
3. The nearest applicable `AGENTS.md`
4. Current repository implementation and established patterns
5. General engineering conventions

A more specific `AGENTS.md` located deeper in the repository applies to files within its scope and may refine or override this file.

Do not use this file to justify assumptions that contradict the actual repository.

---

## 3. Source of Truth

When repository documentation and implementation differ, prefer:

1. Actual implementation
2. Tests
3. Package configuration
4. Current database schema and migrations
5. Deployment/infrastructure configuration
6. Documentation
7. `AGENTS.md` examples

`AGENTS.md` describes intended engineering behavior, but it must not be used to invent repository facts.

Never assume a package, file, endpoint, model, environment variable, script, dependency, or generated artifact exists. Verify it first.

Never claim a file was changed, a command succeeded, or a test passed unless that actually occurred.

---

## 4. Project Overview

This repository is the full-stack monorepo for Koushik Puppala's personal website and CMS.

Primary domain:

```text
https://koushikpuppala.com
```

The platform consists of:

- Public portfolio website
- Private administrative CMS
- Backend API
- PostgreSQL database
- Prisma 7 database access
- Redis
- Firebase Authentication
- Firebase Admin SDK
- AWS S3 media storage
- AWS SES where configured
- Sentry
- API metrics
- Audit logging

The repository currently uses the `revamp/6.x` architecture where applicable.

Do not assume legacy v5 architecture is authoritative. Prefer the current implementation and repository conventions.

---

## 5. Core Architecture

The repository uses:

- pnpm workspaces
- Turborepo
- TypeScript
- Next.js 16
- React 19
- NestJS 11
- Express
- PostgreSQL
- Prisma 7
- Redis
- Firebase Authentication
- Firebase Admin SDK
- AWS S3
- AWS SES where configured
- Sentry
- Tailwind CSS v4
- Biome
- Prettier

High-level boundary:

```text
Internet
   │
   ├── koushikpuppala.com
   │       └── apps/client
   │
   └── admin.koushikpuppala.com
           └── apps/admin
                    │
                    ▼
               apps/server
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      PostgreSQL  Redis      S3
          │
          ▼
    Audit / Metrics
          │
          ▼
       Sentry
```

Keep these boundaries intact.

---

## 6. Monorepo Structure

Expected structure:

```text
.
├── apps/
│   ├── client/
│   ├── admin/
│   └── server/
├── packages/
│   ├── prisma/
│   ├── ui/
│   ├── utils/
│   ├── config/
│   └── types/
├── docs/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── AGENTS.md
```

Do not reorganize this structure without an explicit architectural reason.

Before creating a new package or application, inspect the existing workspace structure and package boundaries.

---

## 7. Application Boundaries

### `apps/client`

`apps/client` is the public website.

It owns:

- Portfolio pages
- Home
- About
- Education
- Experience
- Projects
- Services
- Resume
- Social links
- Public media
- Public contact forms
- Public SEO and metadata
- Public PWA functionality

Primary domain:

```text
koushikpuppala.com
```

### Critical rule

`apps/client` is public-only.

Do not add:

```text
/admin
/cms
/dashboard
/manage
```

or equivalent administrative interfaces to `apps/client`.

Do not expose administrative API operations through the public UI.

Content-management functionality belongs in `apps/admin`.

---

## 8. Admin Application

`apps/admin` is the private CMS and administration application.

It owns:

- Portfolio content management
- Projects
- Project galleries
- Media
- Experience
- Education
- Services
- Resume information
- Social links
- Home/about content
- Contact submissions
- Audit logs
- API metrics where appropriate
- System metadata
- Other administrative operations

Primary domain:

```text
admin.koushikpuppala.com
```

Admin uses the shared frontend stack unless the repository explicitly establishes another architecture:

- Next.js 16
- React 19
- Tailwind CSS v4
- TypeScript
- Shared UI
- Shared utilities/types where appropriate
- Sentry

Admin UX must prioritize:

- Clear workflows
- Validation
- Loading states
- Empty states
- Error states
- Confirmation for destructive actions
- Responsive layouts
- Keyboard accessibility
- Clear success feedback
- Safe media management

---

## 9. Backend Application

`apps/server` is the authoritative backend.

It owns:

- HTTP/API endpoints
- Authentication verification
- Authorization
- Business logic
- Database access
- Redis integration
- S3 integration
- Email integrations
- API metrics
- Audit logging
- Validation
- Error handling
- Swagger/OpenAPI
- Rate limiting
- External service orchestration

Do not duplicate authoritative business rules in `apps/client` or `apps/admin`.

Frontend validation may exist for UX, but backend validation and business rules remain authoritative.

---

## 10. Authentication and Authorization

Authentication uses Firebase Authentication.

The backend uses Firebase Admin SDK for token verification.

Do not casually introduce another authentication provider, including:

- Clerk
- Auth0
- NextAuth/Auth.js
- Custom password authentication

A valid Firebase token does not automatically grant administrative access.

Authorization must be enforced by the backend.

The server is the final authorization boundary.

```text
Firebase Authentication
        ↓
Authenticated identity/token
        ↓
apps/admin
        ↓
apps/server
        ↓
Firebase Admin verification
        ↓
Authorization
        ↓
Business operation
```

Never rely solely on:

- Hidden buttons
- Hidden routes
- React role checks
- Client-side role checks
- Middleware-only authorization

---

## 11. NestJS Architecture

Prefer:

```text
Controller
    ↓
Service
    ↓
Repository / Provider
    ↓
External system / Database
```

Controllers handle HTTP concerns.

Controllers should not contain:

- Complex business logic
- Large database queries
- Redis implementation details
- S3 implementation details
- Complex authorization logic

Keep business logic in services or domain-oriented providers.

Use existing exception, interceptor, middleware, validation, logging, and response patterns before creating new infrastructure.

---

## 12. API Contracts

Maintain stable API contracts.

Before changing an endpoint:

1. Find all consumers.
2. Check `apps/client`.
3. Check `apps/admin`.
4. Check shared types/contracts.
5. Check backend tests.
6. Determine whether the change is breaking.
7. Update documentation when required.

Do not silently change:

- Response shapes
- Field names
- Required parameters
- Nullable behavior
- Pagination behavior
- Authentication requirements
- Authorization requirements
- Error contracts

Prefer backward-compatible changes.

If a breaking change is unavoidable, identify it before implementation.

---

## 13. Swagger / OpenAPI

When adding or significantly changing APIs:

- Maintain Swagger metadata.
- Keep request/response contracts accurate.
- Document authentication requirements.
- Document relevant response codes.
- Keep documentation synchronized with implementation.

Never document behavior that does not exist.

---

## 14. Database and Prisma

The database is PostgreSQL.

The repository uses Prisma 7.

Prisma is owned by:

```text
packages/prisma/
```

The exact schema and generated-client layout must be verified from the repository before making assumptions.

Before changing database behavior:

1. Inspect the relevant schema.
2. Inspect relationships.
3. Inspect indexes and constraints.
4. Inspect existing migrations.
5. Identify all consumers.
6. Consider existing production data.
7. Update Prisma schema/source configuration.
8. Generate/update the migration as appropriate.
9. Update application code.
10. Test the change.

Do not bypass the established Prisma migration workflow for normal schema changes.

Do not introduce another ORM.

Avoid raw SQL unless Prisma cannot express the required operation efficiently or database-specific behavior is genuinely required.

When using raw SQL:

- Parameterize inputs.
- Never interpolate untrusted input.
- Explain why raw SQL is required.
- Consider index usage and query performance.

---

## 15. Migration Safety

Never:

- Rewrite historical migrations.
- Reset a production database.
- Drop production data as part of ordinary development.
- Use destructive production commands casually.
- Delete columns/tables without understanding consumers.
- Assume a successful local migration is automatically production-safe.

For potentially destructive changes:

1. Identify affected data.
2. Identify all consumers.
3. Prefer additive changes.
4. Migrate data where necessary.
5. Move consumers to the new structure.
6. Remove deprecated structures only after they are no longer required.

---

## 16. Transactions

Use Prisma transactions when multiple database operations must be atomic.

Example:

```text
Create project
+
Create gallery entries
+
Create audit record
```

If these must succeed or fail together, use an appropriate transaction boundary.

Do not put unrelated independent work into a single transaction.

Keep external network calls outside database transactions unless the existing architecture explicitly requires otherwise.

---

## 17. Redis and Caching

Redis is supporting infrastructure, not the default source of truth.

PostgreSQL remains the persistent source of truth unless an explicit architecture decision says otherwise.

Before adding a cache, answer:

```text
What is being cached?
Who owns the source of truth?
What is the TTL?
When is it invalidated?
What happens on cache failure?
Can stale data be returned?
Is the data user-specific?
Does the cache key include security/identity context?
```

Every cache needs an intentional invalidation strategy.

Never share authenticated or user-specific data through an insufficient cache key.

Never cache authorization decisions beyond what the security model allows.

For mutations:

```text
Persistent write
    ↓
Invalidate/update cache
```

Do not allow stale cache entries to silently become the source of truth.

---

## 18. Next.js 16 Data Fetching and Caching

Follow the repository's existing Next.js 16 rendering and caching model.

Before adding caching:

- Determine whether data is static, revalidated, dynamic, or user-specific.
- Inspect existing `fetch` patterns.
- Inspect existing cache utilities.
- Inspect `cacheLife`/related caching behavior where used.
- Consider authentication/token expiration.
- Consider cache invalidation.
- Verify behavior after the change.

Do not cache authenticated responses beyond the validity/security requirements of their credentials.

Do not introduce caching merely because it appears faster.

Use request APIs such as `headers()` and `cookies()` consistently with the application's dynamic rendering and caching strategy.

---

## 19. AWS S3 and Media

AWS S3 is the object-storage layer.

Where appropriate, prefer:

```text
Client/Admin
    ↓
Server requests presigned upload
    ↓
S3 presigned URL
    ↓
Client uploads directly to S3
    ↓
Server stores media metadata
```

Do not unnecessarily proxy large media through the backend.

Never expose AWS credentials to:

- `apps/client`
- `apps/admin`
- Browser code

S3 stores actual objects.

PostgreSQL stores media metadata and references.

Do not use PostgreSQL as the primary binary store for large media.

---

## 20. SES / Email

Where SES is configured:

- Email delivery remains server-side.
- Never expose SES credentials to browser code.
- Use the existing email abstraction.
- Do not create independent email implementations when an existing abstraction exists.
- Do not introduce another provider without an architecture decision.

---

## 21. Audit Logging

Administrative mutations should be auditable where the domain requires it.

Useful audit fields include:

- Actor
- Action
- Entity
- Entity identifier
- Timestamp
- Relevant metadata

Do not store:

- Passwords
- Access tokens
- Refresh tokens
- Private keys
- Database credentials
- Other secrets

Do not bypass the existing audit mechanism simply because an operation is internal.

---

## 22. API Metrics

Preserve existing API metrics behavior when modifying backend infrastructure.

Metrics should help answer:

- Which endpoint was called?
- How long did it take?
- What was the result?
- Was it successful?
- What status code was returned?
- When did it occur?

Do not record sensitive request data unnecessarily.

---

## 23. Logging and Request Context

Use the repository's existing logging infrastructure.

Logs should:

- Use appropriate log levels.
- Include useful context.
- Avoid secrets and unnecessary PII.
- Avoid duplicate logging across layers.
- Preserve request/correlation IDs where the repository supports them.

Do not use `console.log` as a replacement for established application logging unless the repository explicitly uses it for that purpose.

Where request IDs/correlation IDs exist:

- Preserve them across middleware/services.
- Include them in relevant logs and error context.
- Do not generate competing IDs downstream.
- Propagate them to external services where the architecture supports it.

---

## 24. Sentry

Use the existing Sentry integrations.

Frontend uses the Next.js integration.

Backend uses the NestJS integration.

Do not introduce another monitoring platform without an architecture decision.

Never send secrets to Sentry, including:

```text
Passwords
Access tokens
Refresh tokens
AWS credentials
Firebase private keys
Database credentials
```

Review error metadata before adding request/user information.

---

## 25. Error Handling

Unexpected errors should:

1. Be logged.
2. Be captured by Sentry where appropriate.
3. Return a safe client response.

Do not expose:

- Stack traces
- Database errors
- Credentials
- Internal service details
- Infrastructure details

Use the repository's existing NestJS exception and response conventions.

Do not create a new error-response format when an established format exists.

Do not silently swallow unexpected exceptions.

---

## 26. Frontend Engineering

Prefer Server Components by default.

Use Client Components only when required by:

- Browser APIs
- React state
- Effects
- Event handlers
- Client-only libraries

Do not add `"use client"` unnecessarily.

Avoid moving server-side work into Client Components without a clear reason.

---

## 27. Frontend Data Access

Frontend applications should use established API/data-access patterns.

Avoid scattering ad-hoc API calls throughout UI components.

Prefer the existing:

- API client
- Server-side data access
- Query hooks
- Mutation utilities
- Cache utilities

The UI should not contain backend business logic.

---

## 28. Shared UI

`packages/ui` contains reusable components.

Before creating a reusable component:

1. Search `packages/ui`.
2. Search the relevant application.
3. Find similar components.
4. Determine whether the existing component can be extended.
5. Only create a new component when reuse is inappropriate.

Do not move highly application-specific UI into shared packages merely for convenience.

---

## 29. Tailwind and UI

The project uses Tailwind CSS v4.

Do not introduce another CSS framework or component library without an explicit decision.

Prefer existing design tokens and component patterns.

Avoid arbitrary custom CSS when Tailwind or an existing shared component already solves the problem.

---

## 30. UI / UX Requirements

Meaningful UI changes should consider:

- Mobile
- Tablet
- Desktop
- Wide desktop
- Loading
- Empty
- Error
- Success
- Disabled
- Accessibility

Avoid fixed-width layouts that cause overflow.

Prefer responsive Tailwind utilities.

Use semantic HTML.

Prefer:

```tsx
<button />
<a />
<nav />
<main />
<section />
<form />
```

over clickable generic elements.

Accessibility should include where applicable:

- Keyboard navigation
- Visible focus states
- Accessible labels
- Semantic headings
- Form error associations
- Sufficient contrast
- Reduced-motion support
- Accessible loading/error feedback

---

## 31. Motion

Use animation intentionally.

Animations should:

- Support hierarchy.
- Improve feedback.
- Preserve usability.
- Avoid excessive motion.
- Respect reduced-motion preferences.

Do not make essential functionality dependent on animation.

---

## 32. TypeScript

Prefer strong typing.

Avoid `any` unless there is a documented reason.

Prefer `unknown` for genuinely unknown data followed by proper narrowing.

Avoid unnecessary type assertions.

Type data correctly at its source whenever possible.

Do not disable TypeScript errors merely to make a build pass.

---

## 33. Shared Types

Use `packages/types` for contracts that genuinely need to be shared.

Do not duplicate the same domain contract independently across applications when a shared type is appropriate.

Do not force server-internal implementation types into shared packages.

Keep public/shared contracts separate from internal implementation details.

---

## 34. Formatting and Linting

Follow the repository configuration.

If the repository uses:

- Biome for linting/code quality
- Prettier for formatting
- Prettier Tailwind CSS plugin for class ordering

then preserve that division.

Do not introduce another formatter or linter.

Do not manually format files against repository configuration.

Format only relevant files where possible.

Avoid repository-wide formatting churn for unrelated work.

---

## 35. Package Management

Use pnpm exclusively.

Do not use:

```text
npm install
yarn install
yarn add
```

Before adding a dependency:

1. Search existing dependencies.
2. Check whether functionality already exists.
3. Consider a small internal utility.
4. Consider bundle size.
5. Consider security.
6. Consider maintenance.
7. Install in the correct workspace.

Prefer workspace-scoped installation, for example:

```bash
pnpm --filter <workspace> add <package>
```

Do not manually edit the lockfile.

Do not add duplicate libraries that solve the same problem.

---

## 36. Generated Files

Do not manually modify generated files when a generator exists.

Before modifying generated output:

1. Identify the source/generator.
2. Change the source/configuration.
3. Regenerate.
4. Verify the generated output.

Do not commit generated artifacts unless the repository already tracks them.

---

## 37. Repository Investigation

Before creating a new file, component, service, hook, utility, endpoint, schema, or abstraction:

1. Search for existing implementations.
2. Search for similar functionality.
3. Search for existing consumers.
4. Identify the closest existing pattern.
5. Reuse or extend it when appropriate.
6. Create a new abstraction only when justified.

Useful repository commands include:

```bash
rg "pattern" .
rg "ComponentName" apps packages
rg "endpoint" apps/server apps/client apps/admin
rg "modelName" packages apps
find . -maxdepth 3 -type f
```

Do not assume conventional paths.

---

## 38. Brownfield Development Rule

This is an existing production-oriented codebase.

Before implementing a feature:

```text
Inspect
  ↓
Understand
  ↓
Find existing pattern
  ↓
Determine affected boundaries
  ↓
Design
  ↓
Implement
  ↓
Verify
```

Search the repository before creating new abstractions.

Do not rewrite working architecture without a requirement.

---

## 39. Security

Treat all external input as untrusted.

Validate:

- Request body
- Query parameters
- Route parameters
- Headers
- Uploaded files
- External service responses
- Webhook payloads

Never trust client-provided:

```text
User ID
Role
Permissions
Ownership
Price
Administrative status
```

Authorization belongs on the backend.

---

## 40. Environment Variables

Never commit secrets.

Examples:

```text
DATABASE_URL
FIREBASE_PRIVATE_KEY
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
SENTRY_AUTH_TOKEN
REDIS_PASSWORD
```

Server-only secrets must never be exposed to browser bundles.

When adding environment variables:

1. Add them to the appropriate environment configuration.
2. Validate required values.
3. Document their purpose where appropriate.
4. Ensure server-only values remain server-side.

---

## 41. Protected Configuration

Do not casually modify:

- `pnpm-workspace.yaml`
- `turbo.json`
- Root `package.json`
- CI/CD configuration
- Docker configuration
- Deployment configuration
- Reverse proxy configuration
- Database migrations
- Authentication configuration
- Sentry configuration
- Infrastructure configuration
- Environment configuration

Inspect the current behavior and understand the impact first.

---

## 42. Performance

Measure before optimizing.

Next.js concerns:

- Excessive Client Components
- Large JavaScript bundles
- Unnecessary hydration
- Duplicate requests
- Poor image handling
- Incorrect caching

Backend concerns:

- N+1 queries
- Unbounded queries
- Missing indexes
- Excessive Redis calls
- Slow external calls

Database concerns:

- Missing indexes
- Inefficient joins
- Excessive relation loading
- Large result sets

Do not perform speculative optimizations.

---

## 43. Testing

Tests should validate behavior.

When changing functionality:

- Update existing tests.
- Add tests for new behavior.
- Test important edge cases.
- Test failure paths.
- Test authorization boundaries.
- Add regression tests for bugs where appropriate.

Do not delete tests because they conflict with an implementation.

Choose the smallest appropriate test scope:

- Pure utility → unit test
- Business logic → unit/integration test
- API endpoint → integration/e2e where appropriate
- Authorization behavior → authorization-focused test
- UI behavior → established component/e2e test
- Regression bug → regression test

Do not optimize for coverage numbers alone.

---

## 44. Verification Scope

Verification should be proportional to the change.

Examples:

- Documentation-only → no application test required
- Styling-only → relevant lint/build/type checks as appropriate
- Utility change → targeted tests
- API change → affected backend tests and consumers
- Database change → migration validation and affected tests
- Authentication/authorization change → security-focused tests
- Cross-application change → affected applications must be verified

Never claim verification that was not performed.

---

## 45. Development Commands

Inspect package scripts before inventing commands.

Common root commands may include:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
pnpm format
```

These commands must be treated as examples until verified against the current `package.json`.

Prefer root scripts when they exist.

For targeted work, prefer scoped commands where appropriate.

---

## 46. Turborepo

Respect Turborepo task dependencies.

Do not bypass Turborepo unnecessarily.

Before changing `turbo.json`, inspect:

- Existing tasks
- Dependencies
- Outputs
- Caching
- Environment variables

Do not change caching behavior without understanding its consequences.

Example, only when supported by the repository:

```bash
pnpm turbo run build --filter=client
```

---

## 47. Package Boundaries

Use workspace packages through their workspace names.

Prefer:

```text
apps/client
    ↓
@repo/ui
@repo/types
@repo/utils
```

Do not create circular dependencies.

In particular:

```text
packages
    ↓
apps
```

should generally not occur.

Shared packages should remain application-independent unless the architecture explicitly requires otherwise.

---

## 48. Git and Change Hygiene

Keep changes focused.

Do not combine unrelated:

```text
Feature
+
Refactor
+
Dependency upgrade
+
Repository-wide formatting
```

unless explicitly requested.

Before completing a task:

1. Inspect the diff.
2. Remove unrelated changes.
3. Check for secrets.
4. Run relevant validation.
5. Confirm affected applications/packages.

Do not leave debugging code, temporary patches, or unexplained TODOs behind.

---

## 49. Architecture Decisions

Do not silently make load-bearing architectural decisions.

Surface the decision before changing:

- Authentication provider
- Authorization model
- Database technology
- Prisma architecture
- Core data model
- Caching architecture
- S3 architecture
- Email provider
- Domain routing
- Application boundaries
- Deployment architecture
- Frontend framework
- Backend framework
- Major API architecture

Use the project's ADR/architecture workflow when available.

---

## 50. Requirements and Ambiguity

Do not invent business requirements.

If ambiguity affects:

- Security
- Data model
- Authorization
- API contract
- Infrastructure
- Cost
- User-facing behavior

surface the ambiguity before making a load-bearing decision.

For small implementation details, follow existing repository conventions.

---

## 51. JSM Skills / Engineering Workflow

This repository may use JSM Skills or equivalent agent skills.

The intended engineering loop is:

```text
/architect → Build → /review → Ship
                 ↓
/imprint  (after UI components)
                 ↓
/remember (start/end sessions)
                 ↓
/recover  (when something breaks)
```

### `/architect`

Use before building meaningful features.

Purpose:

- Think through architecture before implementation.
- Surface important decisions.
- Align on terminology.
- Produce an implementation plan.
- Confirm the plan before significant implementation.

Do not treat architecture as a formal ceremony for trivial changes.

### `/remember`

Use at the beginning and end of meaningful sessions.

- `/remember restore` → restore project/session context.
- `/remember save` → persist important context for future sessions.

Memory should contain durable project context, decisions, constraints, and unfinished work rather than unnecessary noise.

### `/review`

Use after meaningful feature work.

Review:

1. Plan alignment
2. System integrity
3. Production readiness

A feature that works is not automatically correct.

### `/recover`

Use when something goes wrong.

Classify the failure before patching:

- Targeted fix — isolated problem with a clear root cause.
- Hard reset — polluted session where continuing patching is counterproductive.
- Rethink — incorrect foundation requiring a design change.

Do not repeatedly patch symptoms without understanding the underlying failure.

### `/imprint`

Use after building UI components.

- `/imprint` → capture the recently built component's visual patterns.
- `/imprint [file]` → capture patterns from a specific file.
- `/imprint audit` → audit the codebase and establish a UI baseline.

Use this to maintain visual consistency across the product.

If these skills are installed, use them according to their documented behavior. Do not invent unsupported skill commands.

---

## 52. Agent Workflow

### Meaningful feature

```text
/remember restore
      ↓
/architect
      ↓
Develop
      ↓
/imprint       (UI work)
      ↓
/review
      ↓
/test / verify
      ↓
/remember save
```

### Bug

```text
/remember restore
      ↓
/recover
      ↓
Targeted debugging
      ↓
/test
      ↓
/review or /check verify
      ↓
/remember save
```

### Small change

```text
Inspect
  ↓
Implement
  ↓
Verify
```

Do not run every workflow step for trivial changes.

---

## 53. Never Do

Never:

- Rewrite working architecture without a requirement.
- Introduce a new authentication provider casually.
- Expose server secrets to browser code.
- Trust frontend authorization.
- Bypass backend authorization.
- Rewrite historical migrations.
- Reset production databases.
- Use destructive database operations casually.
- Disable TypeScript errors just to pass a build.
- Use `any` merely to silence errors.
- Suppress lint errors without understanding them.
- Delete failing tests to make CI pass.
- Remove error handling to hide failures.
- Introduce duplicate components/utilities unnecessarily.
- Create circular workspace dependencies.
- Add admin functionality to `apps/client`.
- Move authoritative business logic into frontend components.
- Silently change API contracts.
- Commit `.env` files or credentials.
- Claim tests/build/lint passed when they were not run.
- Claim a bug is fixed without verification when verification is possible.
- Assume repository state without inspecting it.

---

## 54. Definition of Done

A change is complete only when applicable requirements have been verified.

```text
[ ] Requested behavior is implemented.
[ ] Correct application/package boundary is used.
[ ] Existing behavior was not unintentionally changed.
[ ] Public functionality remains in apps/client.
[ ] CMS functionality remains in apps/admin.
[ ] Backend authorization is enforced.
[ ] Authentication requirements are preserved.
[ ] Database changes follow the established Prisma workflow.
[ ] Cache behavior is correct.
[ ] S3/media behavior is correct where applicable.
[ ] Audit logging is preserved where required.
[ ] API metrics are preserved where applicable.
[ ] Sentry handling is preserved.
[ ] TypeScript types are correct.
[ ] UI is responsive where applicable.
[ ] Accessibility is considered.
[ ] Relevant lint/format checks pass.
[ ] Relevant tests pass.
[ ] No secrets were introduced.
[ ] No debugging code remains.
[ ] No unexplained temporary workaround remains.
[ ] Documentation is updated when behavior/architecture changed.
[ ] No unrelated files were changed.
[ ] Final diff has been reviewed.
[ ] Verification performed is accurately reported.
```

---

## 55. Completion Report

When completing a meaningful task, report:

1. What changed
2. Files changed
3. Why the changes were made
4. Verification performed
5. Tests run
6. Known limitations or remaining issues

Do not report unverified claims as facts.

---

## 56. Agent Behavior

Act as a senior engineer working inside an existing production codebase.

Prioritize:

1. Correctness
2. Security
3. Architectural consistency
4. Maintainability
5. User experience
6. Performance
7. Developer experience

Do not optimize for lines of code.

Do not rewrite working code unnecessarily.

Do not introduce technologies simply because they are available.

When something fails:

```text
Observe
  ↓
Reproduce
  ↓
Identify root cause
  ↓
Fix root cause
  ↓
Verify
  ↓
Add regression coverage when appropriate
```

When uncertain, inspect the repository before guessing.
