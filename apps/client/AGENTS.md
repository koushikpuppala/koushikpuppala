# Client Application Instructions

## Scope

These rules apply to `apps/client`.

`apps/client` is the public portfolio website.

## Responsibilities

Own:

- Public pages
- Portfolio content presentation
- Public contact forms
- Public SEO/metadata
- Public media
- PWA behavior
- Public-facing UX

## Boundary Rules

Never add administrative functionality to this application.

Do not create:

```text
/admin
/cms
/dashboard
/manage
```

or equivalent CMS interfaces.

Do not expose administrative API operations through the public UI.

Administrative functionality belongs in `apps/admin`.

## Frontend

Use the repository's established:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Shared UI
- Shared types/utilities
- Sentry

Prefer Server Components.

Use `"use client"` only when client behavior is required.

## Data Access

Use established API/data-access patterns.

Do not scatter ad-hoc API calls across UI components.

Do not put backend business rules in the client.

## Caching

Before changing data fetching or caching:

- Inspect existing patterns.
- Determine whether data is public/static/dynamic/user-specific.
- Check authentication implications.
- Check invalidation behavior.
- Verify the result.

## UI

Every meaningful UI change should consider:

- Mobile
- Tablet
- Desktop
- Loading
- Empty
- Error
- Success
- Disabled
- Accessibility

Prefer semantic HTML and reusable existing components.

Search `packages/ui` before creating shared UI.

## Verification

Run the smallest relevant checks for the change.

Do not claim build/lint/tests pass unless executed.
