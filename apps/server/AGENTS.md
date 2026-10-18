# Server Application

## Overview

Authoritative NestJS backend application. It provides HTTP API endpoints, authentication verification, business logic, PostgreSQL database access via Prisma, Redis caching, and audit logging.

## Key files

| File                          | Owns                                                              |
| ----------------------------- | ----------------------------------------------------------------- |
| apps/server/src/main.ts       | Application bootstrap, Swagger setup, and global pipes            |
| apps/server/src/app.module.ts | Root NestJS module registering feature modules and infrastructure |
| apps/server/src/modules/      | Domain feature modules, controllers, and services                 |

## Commands

```bash
# Dev server
pnpm --filter server dev

# Build
pnpm --filter server build

# Lint
pnpm --filter server lint

# Unit tests (Vitest, src/**/*.spec.ts)
pnpm --filter server test

# API integration tests (test/*.e2e-spec.ts; needs docker-compose.test.yml running)
pnpm --filter server test:e2e
```

## Conventions

- Architecture follows Controller to Service to Repository or Provider pattern.
- Controllers handle HTTP concerns and stay thin; business logic belongs in services.
- Authentication uses Firebase Admin SDK for token verification; backend enforces authorization.
- Validate all request inputs using class validator DTOs.
- Return consistent error responses and never expose internal database errors or credentials.
- Record administrative mutations into the audit log.

## Gotchas

- Never trust client provided user identifiers or roles.
- Keep external network calls outside database transactions.
- Never give Create DTO properties default initializers (`= false`, `= []`). `PartialType` copies them into Update DTOs, so every PATCH would reset those fields. Apply defaults in the service's create instead.
- Read the client IP from `req.ip` / `req.context.ip`, never from `X-Forwarded-For` directly. `TRUST_PROXY` (required, e.g. `loopback, linklocal, uniquelocal`) decides which proxies may set it.
- `ConfigModule`, `LoggerModule`, `FirebaseModule`, `DatabaseModule`, `RedisModule` and `AuditLogModule` are global. Export a service from its own module rather than re-providing it elsewhere (duplicates break DI or create second instances).
- CMS controllers carry `@RevalidateTags(...)`. After a successful write the server asks apps/client to refresh those cache tags; set `REVALIDATE_SECRET` (same value as apps/client) and optionally `REVALIDATE_URL` (defaults to `NEXT_PUBLIC_DEPLOY_URL`).
- `POST /api/v1/contacts` (public) checks the reCAPTCHA v3 token (`recaptchaToken`) with Google in `modules/contact/recaptcha.service.ts` before storing anything: it rejects a missing or invalid token, another action, or a score below `RECAPTCHA_MIN_SCORE` (400), and fails closed (503) when Google is unreachable. `RECAPTCHA_SECRET_KEY` is required in production and turns the check off when unset elsewhere (tests).
- After storing a contact message, `ContactService` sends two emails through AWS SES (`common/mail/ses.service.ts`, templates in `modules/contact/contact.emails.ts`): the submission with an admin link (`ADMIN_URL/messages?id=<id>`) to `CONTACT_NOTIFY_EMAIL`, and an acknowledgement to the sender. A failed send is logged and never fails the submission. `SES_FROM_EMAIL` is required in production and turns both emails off when unset elsewhere; honeypot submissions send nothing.
- Admin list endpoints page at 10 by default (`PaginationDto`, max 100) and do their own search, filtering and sorting; the admin never loads a whole list to do it in the browser. A sortable list's query DTO extends `SortablePaginationDto` and whitelists its columns in `<MODULE>_SORT_FIELDS` (`@IsIn`), and the service passes `query.sortBy` / `query.sortOrder` to `getOrderBy()` (`common/services/base-cms.service.ts`) with the list's usual order as the fallback. Totals shown in admin stat cards (`unreadCount`, `urgentCount`, `resolvedCount` on contacts; `adminCount`, `editorCount`, `activeCount` on users) are counted over the whole table and returned next to `items` and `pagination`.
- `AuditLogService.log` names the actor from their user record (by `actorId`, else by the email the CMS controllers pass) and stores their display name. `findAll` returns each entry's current name plus `actorEmail`, and matches older entries that saved only an email, so the list reads the same either way.
- Uploads only accept the types in `modules/media/media.constants.ts`; the content type and size are signed into the presigned URL.
- The resume file must be a live `application/pdf` media row of at most 10 MB (`modules/resume/resume.constants.ts`), checked on create and update. Replacing it removes the old media through `MediaService.remove` after the save; a failed cleanup is only logged. `POST /api/v1/resume/download` (public) returns a 60 second signed S3 link that saves the file as `resumeFileName(title, versionName)` and counts the download only after signing succeeds; its empty `@RevalidateTags()` keeps downloads from refreshing the public site.
- Tests run on Vitest with SWC (`vitest.config.mts`), because Nest's dependency injection needs decorator metadata, which Vitest's default esbuild transform does not emit. Use `import type` for type only imports (for example `Request` from `express`); SWC can't tell and would keep a runtime import.
- CMS writes go through `CmsAuditService` (`modules/audit-log/cms-audit.service.ts`): `created`, `updated`, `togglePublish` and `softDeleted` write the record through a callback and add the audit entry. `publishFields` / `publishUpdate` (`common/utils/publish.util.ts`) set `publishedAt`. Controllers take the actor with `@Actor()` and request logging context with `@Meta()`. Storage and mail are injected through `STORAGE_SERVICE` and `MAIL_SERVICE`; wrap timed operations in `logger.timed()`.
- Types come from `packages/types` (`types/api`, `types/auth`, `types/server`), always as `import type` so SWC drops them. The one local type file is `src/augmentations/express.d.ts`, which adds the request fields to Express. It must not live in `src/types/`: `paths: { "*": ["./src/*"] }` would shadow the `types` package.
- Integration tests boot the real `AppModule` through `configureApp` (`src/bootstrap.ts`, shared with `main.ts`); only `S3Service` and `SesService` are faked.
- The schema enables Prisma's `strictUndefinedChecks`. `DatabaseService` applies `omitUndefinedWrites` (`src/database/omit-undefined.extension.ts`), so `undefined` in write data means "leave out", while `where` filters stay strict. Use `Prisma.skip` if you ever need it explicitly.
- apps/server pins TypeScript `~6.0`; the rest of the repo is on 7.0. Nest CLI (`nest build`) needs TypeScript's programmatic compiler API, which 7.0 doesn't ship (it's expected back in 7.1). Move the server to 7 when Nest CLI supports it.

## Agent skills

- [nestjs-best-practices](~/.agents/skills/nestjs-best-practices/): NestJS modular architecture and dependency injection
- [nestjs-patterns](~/.agents/skills/nestjs-patterns/): NestJS controllers, providers, DTO validation, and guards
- [api-design](~/.agents/skills/api-design/): REST API design patterns and error contracts
- [auth-implementation-patterns](~/.agents/skills/auth-implementation-patterns/): Token verification and backend authorization
- [redis-best-practices](~/.agents/skills/redis-best-practices/): Redis caching and high performance key value operations

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
