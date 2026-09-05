# Admin Application Instructions

## Scope

These rules apply to `apps/admin`.

`apps/admin` is the private CMS and administration application.

## Security Boundary

All CMS functionality is authenticated.

Authentication uses Firebase Authentication.

Backend authorization is authoritative.

Never assume that a Firebase-authenticated user is automatically an administrator.

Never rely solely on:

- Hidden UI
- Client-side role checks
- Route hiding
- Middleware-only authorization

The backend must enforce authorization.

## Responsibilities

Own:

- Portfolio content management
- Project management
- Project galleries
- Media management
- Experience
- Education
- Services
- Resume information
- Social links
- Home/about content
- Contact submissions
- Audit-log views
- Relevant API metrics views
- System metadata

## Frontend

Use the repository's established:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Shared UI
- Shared utilities/types
- Sentry

## UX

Admin workflows must provide appropriate:

- Loading states
- Empty states
- Error states
- Success feedback
- Validation
- Destructive-action confirmation
- Responsive behavior
- Keyboard accessibility

Avoid ambiguous destructive actions.

## Media

Follow the existing S3/presigned-upload architecture.

Never expose AWS credentials.

Do not proxy large files through the backend unnecessarily.

## API

Use established API/data-access patterns.

Do not duplicate business rules in the admin frontend.

## Auditability

Preserve existing audit logging for administrative mutations.

Do not log secrets or credentials.

## Verification

For changes affecting permissions, authentication, API behavior, or data mutations, verify both successful and failure/unauthorized paths.
