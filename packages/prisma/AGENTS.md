# Prisma Package

## Overview

Database integration package. It manages the PostgreSQL database schema, migrations, seed scripts, and the generated Prisma 7 database client.

## Key files

| File                                   | Owns                                                    |
| -------------------------------------- | ------------------------------------------------------- |
| packages/prisma/prisma/schema.prisma   | Prisma client configuration and datasource              |
| packages/prisma/prisma/schema/*.prisma | Domain-separated Prisma models and relations            |
| packages/prisma/src/client.ts          | Prisma client export and client instantiation           |
| packages/prisma/src/seed.ts            | Seed entry: reads env, runs the seed in one transaction |
| packages/prisma/src/seed/              | Seed data (`content.ts`) and upsert steps (`steps.ts`)  |
| packages/prisma/prisma/migrations/     | Versioned SQL migration history                         |

## Commands

```bash
# Push schema changes to development database
pnpm --filter @repo/prisma db:push

# Generate Prisma client
pnpm --filter @repo/prisma db:generate

# Create migration
pnpm --filter @repo/prisma db:migrate:dev

# Deploy migrations
pnpm --filter @repo/prisma db:migrate:deploy
```

## Conventions

- PostgreSQL is the persistent source of truth.
- Never rewrite historical migrations; use additive migrations for schema changes.
- Never reset or drop production databases.
- Use Prisma as the default database abstraction; use parameterized raw SQL only when required.
- Keep Prisma transactions focused on operations that must succeed or fail together.

## Gotchas

- Always inspect existing consumers before renaming columns or changing relation models.
- Verify generated client output before importing in backend services.

## Agent skills

- [prisma](~/.agents/skills/prisma/): Prisma ORM type safe database queries and schema design
- [prisma-patterns](~/.agents/skills/prisma-patterns/): Prisma ORM transactions, pagination, and migration safety
- [postgresql-best-practices](~/.agents/skills/postgresql-best-practices/): PostgreSQL schema design and query optimization
- [database-migrations](~/.agents/skills/database-migrations/): Database migration practices and zero downtime deployments

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
