# Admin Application

## Overview

Private administrative CMS application. It manages portfolio content, projects, media, experience, education, services, social links, contact messages, and audit logs.

## Key files

| File | Owns |
|---|---|
| apps/admin/app/layout.tsx | Root layout, shell setup, and global providers |
| apps/admin/components/admin-shell.tsx | Fixed sidebar, navigation, and top bar header |
| apps/admin/components/cms/collection-manager.tsx | Standardized collection views with built in DataTable search and filters |
| apps/admin/lib/api-client.ts | Authenticated API client communicating with backend |

## Commands

```bash
# Dev server
pnpm --filter admin dev

# Build
pnpm --filter admin build

# Lint
pnpm --filter admin lint
```

## Conventions

* All CMS functionality requires authenticated sessions verified by the backend.
* Backend authorization is authoritative; never rely solely on client role checks or hidden buttons.
* The API is the ONLY source of truth for business data; never use mock, sample, or fallback business data.
* Empty API responses render clear empty states, while errors render actionable error alerts with retry triggers.
* Use the built in DataTable controls for search, filters, pagination, and sorting rather than separate custom toolbars.
* Sidebar remains fixed on the screen while main content scrolls smoothly.

## Gotchas

* Client side checks alone do not grant administrative access; apps/server enforces all RBAC rules.
* Destructive actions require confirmation dialogs before invoking server mutations.

## Agent skills

* [nextjs-app-router-patterns](~/.agents/skills/nextjs-app-router-patterns/): Next.js App Router and server actions
* [react](~/.agents/skills/react/): Modern React patterns and state handling
* [tailwindcss](~/.agents/skills/tailwindcss/): Tailwind CSS utility styling
* [ui-ux-pro-max](~/.agents/skills/ui-ux-pro-max/): Production grade CMS interfaces and UX density
* [vercel-composition-patterns](~/.agents/skills/vercel-composition-patterns/): Clean component composition and performance
* [web-design-guidelines](~/.agents/skills/web-design-guidelines/): Design review and UX best practices

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
