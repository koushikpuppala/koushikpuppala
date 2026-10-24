# Client Application

## Overview

Public portfolio website for Koushik Puppala. It renders portfolio pages, experience, education, projects, services, resume, and public inquiry contact forms.

## Key files

| File                                   | Owns                                                                                                                 |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| apps/client/app/layout.tsx             | Root HTML layout, font setup, and providers                                                                          |
| apps/client/app/page.tsx               | Public portfolio homepage                                                                                            |
| apps/client/src/components/            | Public presentation UI components                                                                                    |
| apps/client/src/components/shell/      | Site header, mobile menu, quick palette, footer; `site-shell.tsx` composes them                                      |
| apps/client/src/components/primitives/ | `motion.tsx` (Reveal, Magnetic…), `layout.tsx` (Section, SectionHeader, Chip, PulseDot), `feedback.tsx` (EmptyState) |
| apps/client/src/lib/fetch-published.ts | Shared fetch for the `'use cache'` actions in `src/actions/cache`, with the short failure cache                      |
| apps/client/src/lib/api-result.ts      | `unwrap()`: logs a failed `ApiResponse` and returns its result or null                                               |
| apps/client/src/styles/globals.css     | Global styling and Tailwind CSS setup                                                                                |

## Commands

```bash
# Dev server
pnpm --filter client dev

# Build
pnpm --filter client build

# Lint
pnpm --filter client lint
```

## Conventions

- apps/client is public only; never add administrative or CMS routes here.
- Prefer React Server Components by default; use client components only when interactivity or browser APIs are required.
- Styling uses Tailwind CSS v4; follow existing design tokens and aesthetic hierarchy.
- Use established data access patterns; do not scatter ad hoc API calls across UI components.
- Ensure responsive layouts, semantic HTML, and accessibility traits for all components.
- Types come from `packages/types`: models from `types/models`, API shapes from `types/api`, and page and component props from `types/components/client`. Never declare a type in this app, including inline prop objects.

## Gotchas

- Content management interfaces belong in apps/admin, never in apps/client.
- Server actions and public endpoints must validate all user inputs.
- Never add fallback or sample portfolio content. When the API fails, loaders in `src/lib/*-data.ts` return empty values (`src/constants/empty-content.ts`) and the failed fetch is cached for minutes only (`cacheLife('minutes')` in the catch block).
- Cached fetchers carry a shared tag per content type (`projects`, `skills`, ...). The API refreshes them through `POST /api/revalidate`, which needs `REVALIDATE_SECRET` (same value as apps/server).
- With Cache Components, `generateStaticParams` must return at least one entry, even when the API is down at build time.
- Analytics (`src/components/analytics.tsx`, mounted in the root layout): Google Analytics through `@next/third-parties`, plus `src/components/web-vitals.tsx`, which starts Microsoft Clarity (`@microsoft/clarity`) once the browser is idle and sends Core Web Vitals to GA with `sendGAEvent`. Each runs only when `NEXT_PUBLIC_GOOGLE_ANALYTICS` / `NEXT_PUBLIC_MICROSOFT_CLARITY` is set and matches its ID format. They are inlined at build time, so Docker builds read them from the `env` build secret.
- Content security policy (`next.config.ts`): pages stay prerendered, so scripts keep `'unsafe-inline'`, but script, connect and frame origins are allowlisted (Google Analytics, Clarity, reCAPTCHA, Sentry). Adding a third-party script or endpoint means adding its origin there; `apps/e2e/tests/client/content-security-policy.spec.ts` fails on any violation. Zod runs with `z.config({ jitless: true })` so it never probes for eval.
- Images: the image optimizer only accepts the media CDN, built from the required `CDN_URL`.
- Contact spam protection: `app/contact/page.tsx` wraps the form in `ReCaptchaProvider` (`next-recaptcha-v3`), which loads Google's reCAPTCHA v3 script on that page only. On submit the form gets a token for the `contact_form_submit` action, and `app/api/contact/route.ts` forwards it to the API, which verifies it. Without `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` no script loads and no token is sent. The floating badge is hidden in `globals.css`, so the form shows Google's required attribution text instead.
- Sitemap: static routes come from `app/**/page.tsx`, globbed with globby (`src/lib/static-routes.ts`) when the sitemap renders. It renders on demand, so `outputFileTracingIncludes` in `next.config.ts` copies the page files into the standalone image. New pages appear automatically; dynamic, `_private` and `@slot` routes are skipped. Project detail pages are added from the API.
- The resume Download button links to `/resume/download` (`app/resume/download/route.ts`) with `prefetch={false}` and `rel='nofollow'`, never to the file. The route asks the API to count the download and redirects to the signed S3 link, or back to `/resume` on any failure. Prefetching it would count a download, and `robots.tsx` disallows it. A `Link` click first fetches the route through Next's router (`rsc` header); the route answers that with an empty 204 and no count, so the router falls back to one real page load, which counts once.
- Every route has its own `loading.tsx`, built from `src/components/skeletons.tsx` inside `SiteShell` (rendered without socials so it needs no data). Keep a route's skeleton in step with its layout when the page changes.
- Tests: `pnpm --filter client test` (Vitest, MSW in `test/`, `next/cache` stubbed). Route handlers are tested by calling `POST(new Request(...))`; pages are covered by apps/e2e.

## Agent skills

- [nextjs-app-router-patterns](~/.agents/skills/nextjs-app-router-patterns/): Next.js App Router with Server Components and streaming
- [react](~/.agents/skills/react/): Modern React patterns and hooks
- [tailwindcss](~/.agents/skills/tailwindcss/): Tailwind CSS styling and responsive design
- [frontend-design](~/.agents/skills/frontend-design/): Aesthetic direction and typography for distinctive interfaces
- [design-taste-frontend](~/.agents/skills/design-taste-frontend/): Non templated frontend portfolio design
- [uncodixfy](~/.agents/skills/uncodixfy/): Clean human designed aesthetics
- [frontend-a11y](~/.agents/skills/frontend-a11y/): Accessible HTML semantics and keyboard navigation

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
