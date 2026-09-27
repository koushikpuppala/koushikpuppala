# Server Application

## Overview

Authoritative NestJS backend application. It provides HTTP API endpoints, authentication verification, business logic, PostgreSQL database access via Prisma, Redis caching, and audit logging.

## Key files

| File | Owns |
|---|---|
| apps/server/src/main.ts | Application bootstrap, Swagger setup, and global pipes |
| apps/server/src/app.module.ts | Root NestJS module registering feature modules and infrastructure |
| apps/server/src/modules/ | Domain feature modules, controllers, and services |

## Commands

```bash
# Dev server
pnpm --filter server dev

# Build
pnpm --filter server build

# Lint
pnpm --filter server lint
```

## Conventions

* Architecture follows Controller to Service to Repository or Provider pattern.
* Controllers handle HTTP concerns and stay thin; business logic belongs in services.
* Authentication uses Firebase Admin SDK for token verification; backend enforces authorization.
* Validate all request inputs using class validator DTOs.
* Return consistent error responses and never expose internal database errors or credentials.
* Record administrative mutations into the audit log.

## Gotchas

* Never trust client provided user identifiers or roles.
* Keep external network calls outside database transactions.

## Agent skills

* [nestjs-best-practices](~/.agents/skills/nestjs-best-practices/): NestJS modular architecture and dependency injection
* [nestjs-patterns](~/.agents/skills/nestjs-patterns/): NestJS controllers, providers, DTO validation, and guards
* [api-design](~/.agents/skills/api-design/): REST API design patterns and error contracts
* [auth-implementation-patterns](~/.agents/skills/auth-implementation-patterns/): Token verification and backend authorization
* [redis-best-practices](~/.agents/skills/redis-best-practices/): Redis caching and high performance key value operations

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
