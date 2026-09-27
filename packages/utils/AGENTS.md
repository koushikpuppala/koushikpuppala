# Shared Utilities Package

## Overview

Shared utilities package. It provides deterministic helper functions, string formatting, date utilities, and styling class merging.

## Key files

| File | Owns |
|---|---|
| packages/utils/src/classNames.ts | Tailwind class merging and conditional styling |
| packages/utils/src/formatDate.ts | Date formatting helpers |
| packages/utils/src/useFormReducer.ts | Reusable form state reducer with schema validation |

## Commands

```bash
# Type check
pnpm --filter utils check-types
```

## Conventions

* Utilities must be small, focused, and deterministic.
* Avoid UI state, backend business logic, or database access inside utilities.
* Prefer pure functions with strong TypeScript input and output types.

## Gotchas

* Search existing utilities before introducing new helper functions.

## Agent skills

* [typescript](~/.agents/skills/typescript/): Pure deterministic helper functions and strong types

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
