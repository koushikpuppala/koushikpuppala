# Shared UI Package

## Overview

Reusable component library. It provides application independent UI primitives, interactive components, data tables, dialogs, and design token styling.

## Key files

| File | Owns |
|---|---|
| packages/ui/src/designs/data-table.tsx | Reusable DataTable component with built in search, filters, and pagination |
| packages/ui/src/table.tsx | Accessible table element primitives |
| packages/ui/style.css | Shared Tailwind CSS styling imports |

## Commands

```bash
# Type check
pnpm --filter ui check-types
```

## Conventions

* Components must stay reusable and application independent.
* Avoid embedding application specific business logic or backend calls in UI components.
* Use Tailwind CSS v4 and existing design tokens.
* Support keyboard navigation, focus indicators, and accessible labels.

## Gotchas

* Search packages/ui before creating a new component to avoid duplication.
* Test components across mobile, tablet, and desktop viewports.

## Agent skills

* [tailwind-design-system](~/.agents/skills/tailwind-design-system/): Design tokens and reusable component libraries
* [web-component-design](~/.agents/skills/web-component-design/): Reusable component architecture and composition
* [accessibility](~/.agents/skills/accessibility/): Inclusive digital components and accessible traits

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
