# Prisma Package Instructions

## Scope

These rules apply to `packages/prisma`.

This package owns the repository's Prisma 7 database integration.

## Database

Database:

```text
PostgreSQL
```

ORM:

```text
Prisma 7
```

The exact Prisma schema and generated-client configuration must be verified from the current package configuration.

Do not assume generated output paths.

## Schema Changes

Before modifying the schema:

1. Inspect the relevant model/schema files.
2. Inspect relations.
3. Inspect indexes and constraints.
4. Inspect existing migrations.
5. Search all consumers.
6. Consider existing production data.
7. Make the smallest safe schema change.

## Migrations

Never rewrite historical migrations.

Never reset production databases.

Prefer additive migrations for potentially destructive changes.

Do not delete data merely to simplify a migration.

## Queries

Use Prisma as the default database abstraction.

Use raw SQL only when genuinely required.

When raw SQL is necessary:

- Parameterize values.
- Never interpolate untrusted input.
- Document why it is required.
- Consider query plans and indexes.

## Transactions

Use transactions for operations that must be atomic.

Do not hold database transactions open while making unnecessary external network calls.

## Client Generation

Do not manually edit generated Prisma client output.

Modify the source/configuration and regenerate using the repository's established command.

## Verification

After schema/client changes:

- Generate the client when required.
- Validate affected packages.
- Run relevant tests.
- Inspect migration output.
- Confirm affected application consumers.
