# Client Application

## Overview

Public portfolio website for Koushik Puppala. It renders portfolio pages, experience, education, projects, services, resume, and public inquiry contact forms.

## Key files

| File | Owns |
|---|---|
| apps/client/app/layout.tsx | Root HTML layout, font setup, and providers |
| apps/client/app/page.tsx | Public portfolio homepage |
| apps/client/components/ | Public presentation UI components |
| apps/client/styles/globals.css | Global styling and Tailwind CSS setup |

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

* apps/client is public only; never add administrative or CMS routes here.
* Prefer React Server Components by default; use client components only when interactivity or browser APIs are required.
* Styling uses Tailwind CSS v4; follow existing design tokens and aesthetic hierarchy.
* Use established data access patterns; do not scatter ad hoc API calls across UI components.
* Ensure responsive layouts, semantic HTML, and accessibility traits for all components.

## Gotchas

* Content management interfaces belong in apps/admin, never in apps/client.
* Server actions and public endpoints must validate all user inputs.

## Agent skills

* [nextjs-app-router-patterns](~/.agents/skills/nextjs-app-router-patterns/): Next.js App Router with Server Components and streaming
* [react](~/.agents/skills/react/): Modern React patterns and hooks
* [tailwindcss](~/.agents/skills/tailwindcss/): Tailwind CSS styling and responsive design
* [frontend-design](~/.agents/skills/frontend-design/): Aesthetic direction and typography for distinctive interfaces
* [design-taste-frontend](~/.agents/skills/design-taste-frontend/): Non templated frontend portfolio design
* [uncodixfy](~/.agents/skills/uncodixfy/): Clean human designed aesthetics
* [frontend-a11y](~/.agents/skills/frontend-a11y/): Accessible HTML semantics and keyboard navigation

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
