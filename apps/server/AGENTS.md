# Server Application Instructions

## Scope

These rules apply to `apps/server`.

`apps/server` is the authoritative NestJS backend.

## Responsibilities

Own:

- API endpoints
- Authentication verification
- Authorization
- Business logic
- Database access
- Redis
- S3
- Email integrations
- API metrics
- Audit logging
- Validation
- Error handling
- Swagger/OpenAPI
- Rate limiting
- External service orchestration

## Architecture

Prefer:

```text
Controller
    ↓
Service
    ↓
Repository / Provider
    ↓
Database / External System
```

Controllers should remain thin.

Do not put complex business logic, large queries, or infrastructure implementation directly into controllers.

## Authentication

Use Firebase Admin SDK for backend token verification.

Do not introduce another authentication provider without an explicit architecture decision.

## Authorization

Authorization is enforced on the backend.

Never trust client-provided:

- User ID
- Role
- Permissions
- Ownership
- Price
- Administrative status

## Database

Use the established Prisma 7 integration through `packages/prisma`.

Before changing database behavior:

1. Inspect the relevant schema.
2. Inspect relationships and indexes.
3. Inspect migrations.
4. Identify consumers.
5. Consider production data.
6. Implement the smallest safe change.
7. Verify it.

Do not introduce another ORM.

## API Contracts

Preserve established request, response, error, authentication, and authorization contracts.

Check both frontend applications before changing an endpoint.

Maintain Swagger metadata.

## Validation

Validate all external input:

- Body
- Query
- Route parameters
- Headers
- Files
- Webhooks
- External responses

## Errors

Use the repository's existing NestJS exception/filter conventions.

Do not expose internal errors, stack traces, credentials, or infrastructure details.

## Logging and Metrics

Preserve existing logging, request IDs, API metrics, and audit logging.

Avoid secrets and unnecessary sensitive data.

## Redis

Treat PostgreSQL as the persistent source of truth.

Use deliberate cache keys and invalidation.

Never leak user-specific data through shared cache entries.

## S3

Keep AWS credentials server-side.

Prefer presigned uploads for appropriate media flows.

## Verification

For backend changes, run relevant type/lint/tests and verify affected consumers.

For security-sensitive changes, verify both authorized and unauthorized paths.
